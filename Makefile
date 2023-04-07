SRC = $(wildcard nbs/*.ipynb)

.PHONY: all
all: clean dist .install_pre_commit_hooks

fastkafkachat: $(SRC) settings.ini
	touch README.md
	nbdev_export
	touch fastkafkachat
    
.install_pre_commit_hooks:
	pre-commit install
	touch .install_pre_commit_hooks

.PHONY: install_fastkafkachat_client
install_fastkafkachat_client:
	cd client && npm install

.PHONY: build_fastkafkachat_client
build_fastkafkachat_client: install_fastkafkachat_client
	cd client && npm run build

dist: fastkafkachat build_fastkafkachat_client
	python3 setup.py sdist bdist_wheel
	pip install -e '.[dev]'
	touch dist

serve: dist ./start_webservice.sh
	./start_webservice.sh
    
mypy: fastkafkachat
	mypy fastkafkachat

.install_git_secrets_hooks:
	git secrets --install -f
	git secrets --register-aws
	touch .install_git_secrets_hooks

.add_allowed_git_secrets: .install_git_secrets_hooks allowed_secrets.txt
	git secrets --add -a "dummy"
	git config --unset-all secrets.allowed
	cat allowed_secrets.txt | xargs -I {} git secrets --add -a {}
	touch .add_allowed_git_secrets

check_secrets: .add_allowed_git_secrets
	git secrets --scan -r
    
check_git_history_for_secrets: .add_allowed_git_secrets
	git secrets --scan-history
    
detect_secrets: .install_pre_commit_hooks
	git ls-files -z | xargs -0 detect-secrets-hook --baseline .secrets.baseline
    
sast: .sast_bandit .sast_semgrep

.sast_bandit: fastkafkachat
	bandit -r fastkafkachat
	touch .sast_bandit

.sast_semgrep: fastkafkachat
	semgrep --config auto --error
	touch .sast_semgrep

trivy_scan_repo:
	./scripts/trivy_scan_repo.sh

check: mypy check_secrets detect_secrets sast trivy_scan_repo

test_client: client client/package.json
	CI=true npm test --prefix ./client/ -- --coverage --silent=true

test: mypy dist test_client
	nbdev_test --timing --do_print --pause 1
    
.PHONY: prepare
prepare: all check test_client
	nbdev_mkdocs prepare

clean:
	rm -rf fastkafkachat
	rm -rf fastkafkachat.egg-info
	rm -rf build
	rm -rf dist
	rm -rf mkdocs/docs/
	rm -rf mkdocs/site/
	pip uninstall fastkafkachat -y
