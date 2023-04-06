#!/bin/bash

pip install -e '.[dev]'
python3 -c "from fastkafkachat.server import run_webserver; run_webserver('./public')"
