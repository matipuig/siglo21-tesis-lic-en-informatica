#
# Algorithms
# Contains the interface to interact with all the algorithms.
#

import os
from typing import  List
from text_classifier import utils


class Algorithms:
    # An array with the algorithm files information like { name, version, file_path}. 
    algorithms = []

    def __init__(self, algorithms_dir_path: str):
        self.algorithms_dir_path = algorithms_dir_path
        self._load_all_algorithms_from_folder()


    def list_algorithms(self) -> List[dict]:
        result = []
        for algorithm in self.algorithms:
            algorithm_data = { 
                "name": algorithm["name"], 
                "version": algorithm["version"], 
                "type": algorithm["type"],
                "file_name": algorithm["file_name"]
            }
            result.append(algorithm_data)
        return result


    def list_algorithms_by_type(self, type: str) -> List[dict]:
        algorithms_list = self.list_algorithms()
        return [a for a in algorithms_list if a["type"] == type]
    

    def find_algorithm(self, name: str, version: str) -> dict:
        for algorithm in self.algorithms:
            if algorithm["name"] == name and algorithm["version"] == version:
                return self._load_algorithm_from_file(algorithm["file_path"])
        raise Exception(f'Cannot find algorithm "{name}" version "{version}".')

    #
    # PRIVATE METHODS.
    #

    def _load_all_algorithms_from_folder(self):
        self.algorithms = []
        algorithms_dir_path = self.algorithms_dir_path
        algorithms_dir_contents = [os.path.join(algorithms_dir_path, f) for f in os.listdir(algorithms_dir_path)]
        algorithms_dir_files = [f for f in algorithms_dir_contents if os.path.isfile(f)]
        algorithm_algo_files =  [f for f in algorithms_dir_files if f.endswith(".algo")]
        for file_path in algorithm_algo_files:
            algorithm_content = self._load_algorithm_from_file(file_path)
            algorithm_info = {
                "name": algorithm_content["name"],
                "version": algorithm_content["version"],
                "type": algorithm_content["type"],
                "file_name": os.path.basename(file_path),
                "file_path": file_path
            }
            self.algorithms.append(algorithm_info)
        self._warn_duplicates_in_loaded_algorithms()


    def _load_algorithm_from_file(self, file_path: str) -> dict:
        file_content = utils.load_with_pickle(file_path)
        if not type(file_content) is dict:
            raise Exception(f'The file "{file_path}" is not a valid algorithm file.') 
        required_properties = ["name","version","description","observations","date","type","classifiers","classification_stats","sample_training_stats","dataset_information"]
        dataset_properties = file_content.keys()
        for required_property in required_properties:
            if required_property not in dataset_properties:
                raise Exception(f'The file "{file_path}" is not a valid algorithm file. Property "{required_property}" is missing.')
        return file_content 


    def _warn_duplicates_in_loaded_algorithms(self):  
        for algorithm_outer in self.algorithms:
            for algorithm_inner in self.algorithms:
                if algorithm_inner["name"] == algorithm_outer["name"] and algorithm_inner["version"] == algorithm_outer["version"]:
                    if algorithm_outer["file_name"] != algorithm_inner["file_name"]:
                        error_message = f'The files "{algorithm_outer["file_name"]}" and "{algorithm_inner["file_name"]}" have the same name and version.'
                        print(f'Warning: {error_message}.')