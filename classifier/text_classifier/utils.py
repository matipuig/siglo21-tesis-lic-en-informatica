#
# Utils
# Contains some utilities functions.
#

import pickle

def load_with_pickle(file_path):
    file = open(file_path, 'rb')
    file_content = file.read()
    file.close()
    return pickle.loads(file_content)