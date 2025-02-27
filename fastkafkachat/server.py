# AUTOGENERATED! DO NOT EDIT! File to edit: ../nbs/API_Web_Service.ipynb.

# %% auto 0
__all__ = ['create_fastapi_app', 'run_webserver']

# %% ../nbs/API_Web_Service.ipynb 1
from pathlib import Path
from typing import *
from os import environ

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastcore.imports import in_notebook, in_ipython
import uvicorn

from . import chat_generator

# %% ../nbs/API_Web_Service.ipynb 2
def create_fastapi_app(
    public_path: Path = Path("../client/build")
) -> FastAPI:
    """Create a FastAPI application.

    Args:
        public_path: Path to the public directory containing static files.

    Returns:
        The FastAPI application.

    !!! note

        The above docstring is autogenerated by docstring-gen library (https://docstring-gen.airt.ai)
    """
    app = FastAPI()
    public_path = Path(public_path).resolve()
    app.include_router(chat_generator.router)
    app.mount("/", StaticFiles(directory=public_path, html = True), name="public")
    return app

# %% ../nbs/API_Web_Service.ipynb 4
def run_webserver(public_path: str) -> None:
    """Runs a webserver

    Args:
        public_path: Path to the public directory containing static files.

    !!! note

        The above docstring is autogenerated by docstring-gen library (https://docstring-gen.airt.ai)
    """
    app = create_fastapi_app(public_path=Path(public_path))
    port = int(environ.get("PORT", 4000))
    uvicorn.run(app, host="0.0.0.0", port=port) # nosec B104
