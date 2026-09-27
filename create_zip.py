#!/usr/bin/env python3
import os
import zipfile
import shutil

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(ROOT_DIR, 'public')
DIST_DIR = os.path.join(ROOT_DIR, 'dist')

os.makedirs(PUBLIC_DIR, exist_ok=True)

# 1. First ensure dist exists by running build if needed or copying current files
STATIC_ZIP_PATH = os.path.join(PUBLIC_DIR, 'digital-life-archive-website.zip')
SOURCE_ZIP_PATH = os.path.join(PUBLIC_DIR, 'digital-life-archive-source.zip')
ROOT_ZIP_PATH = os.path.join(ROOT_DIR, 'digital-life-archive.zip')

print("Generating ZIP packages for Digital Life Archive...")

# Package 1: Complete Static Website (from dist/)
if os.path.exists(DIST_DIR):
    with zipfile.ZipFile(STATIC_ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(DIST_DIR):
            for file in files:
                # Do not re-zip the zip file itself if it happens to be copied
                if file.endswith('.zip'):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, DIST_DIR)
                zipf.write(file_path, arcname)
    print(f"Created {STATIC_ZIP_PATH} ({os.path.getsize(STATIC_ZIP_PATH)} bytes)")
    # Also copy to root as digital-life-archive.zip
    shutil.copyfile(STATIC_ZIP_PATH, ROOT_ZIP_PATH)
    print(f"Created {ROOT_ZIP_PATH} ({os.path.getsize(ROOT_ZIP_PATH)} bytes)")
    # Copy to dist as well
    dist_zip_website = os.path.join(DIST_DIR, 'digital-life-archive-website.zip')
    dist_zip_root = os.path.join(DIST_DIR, 'digital-life-archive.zip')
    shutil.copyfile(STATIC_ZIP_PATH, dist_zip_website)
    shutil.copyfile(STATIC_ZIP_PATH, dist_zip_root)

# Package 2: Full Source Code (excluding node_modules, dist, __pycache__, .git)
EXCLUDE_DIRS = {'node_modules', 'dist', '.git', '__pycache__', '.venv', 'venv'}
EXCLUDE_FILES = {'digital-life-archive.zip', 'digital-life-archive-website.zip', 'digital-life-archive-source.zip'}

with zipfile.ZipFile(SOURCE_ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for file in files:
            if file in EXCLUDE_FILES or file.endswith('.pyc'):
                continue
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, ROOT_DIR)
            zipf.write(file_path, arcname)

print(f"Created {SOURCE_ZIP_PATH} ({os.path.getsize(SOURCE_ZIP_PATH)} bytes)")
if os.path.exists(DIST_DIR):
    shutil.copyfile(SOURCE_ZIP_PATH, os.path.join(DIST_DIR, 'digital-life-archive-source.zip'))
print("All zip archives created successfully!")
