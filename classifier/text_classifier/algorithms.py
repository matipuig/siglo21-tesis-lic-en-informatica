#
# Algorithms
# Contains the interface to interact with all the algorithms.
#

import os
from typing import  List
from text_classifier import utils

class Algorithms:
    # An array with the algorithm files information like { name, type, file_path}. 
    algorithms = []

    def __init__(self, algorithms_dir_path: str):
        self.algorithms_dir_path = algorithms_dir_path
        self._load_all_algorithms_from_folder()

    def list_algorithms(self) -> List[dict]:
        result = []
        for algorithm in self.algorithms:
            algorithm_data = { 
                "name": algorithm["name"], 
                "type": algorithm["type"],
                "file_name": algorithm["file_name"]
            }
            result.append(algorithm_data)
        return result

    def list_algorithms_by_type(self, type: str) -> List[dict]:
        algorithms_list = self.list_algorithms()
        return [a for a in algorithms_list if a["type"] == type]   

    def find_algorithm(self, name: str) -> dict:
        for algorithm in self.algorithms:
            if algorithm["name"] == name:
                return self._load_algorithm_from_file(algorithm["file_path"])
        raise Exception(f'Cannot find algorithm "{name}".')

    #
    # PRIVATE METHODS.
    #

    def _load_all_algorithms_from_folder(self):
        self.algorithms = []
        algorithm_algo_file_paths = self._get_algorithms_file_paths_from_folder()
        for file_path in algorithm_algo_file_paths:
            filename_without_extension = os.path.splitext(os.path.basename(file_path))[0]
            algorithm_content = self._load_algorithm_from_file(file_path)
            algorithm_info = {
                "name": filename_without_extension,
                "type": algorithm_content["type"],
                "file_path": file_path
            }
            self.algorithms.append(algorithm_info)

    def _get_algorithms_file_paths_from_folder(self):
        algorithms_dir_path = self.algorithms_dir_path
        algorithms_dir_contents = [os.path.join(algorithms_dir_path, f) for f in os.listdir(algorithms_dir_path)]
        algorithms_dir_files = [f for f in algorithms_dir_contents if os.path.isfile(f)]
        algorithm_algo_files =  [f for f in algorithms_dir_files if f.endswith(".algo")]
        return algorithm_algo_files

    def _load_algorithm_from_file(self, file_path: str) -> dict:
        file_content = utils.load_with_pickle(file_path)
        if not type(file_content) is dict:
            raise Exception(f'The file "{file_path}" is not a valid algorithm file.') 
        required_properties = ["description","observations","date","type","classifiers","classification_stats","sample_training_stats","dataset_information"]
        dataset_properties = file_content.keys()
        for required_property in required_properties:
            if required_property not in dataset_properties:
                raise Exception(f'The file "{file_path}" is not a valid algorithm file. Property "{required_property}" is missing.')
        return file_content 
