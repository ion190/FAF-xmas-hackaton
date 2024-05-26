import os
import re


def rename_files(path):
    pattern_to_capture = r'(\d{2})_(\d{2})_(\d{4}).txt'
    replace_with = r"\3-\2-\1.md"

    comp = re.compile(pattern_to_capture)
    for f in os.listdir(path):
        full_path = os.path.join(path, f)
        if os.path.isfile(full_path):

            match = comp.search(f)
            if not match:
                continue

            try:
                new_name = match.expand(replace_with)
                new_name = os.path.join(path, new_name)
            except re.error:
                continue

            if os.path.isfile(new_name):
                print('%s -> %s skipped' % (f, new_name))
            else:
                os.rename(full_path, new_name)
        elif os.path.isdir(full_path):
            rename_files(full_path)


home_path = os.path.expanduser('~')
rename_files(home_path + '/Desktop/diary-entries/handwritten')
