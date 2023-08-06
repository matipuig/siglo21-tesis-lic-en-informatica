#
# Text_classifiers
# Classify the specified text with the different classifiers.
#

import datetime
# import ntlk
import re
import string
import text_classifier.settings as local_settings
from text_classifier.algorithms import Algorithms
import unicodedata

algorithms = Algorithms(local_settings.ALGORITHMS_DIR_PATH)

class Classifiers:

    def __init__(self):
        self.algorithms = algorithms
        return

    def classify(self, name: str, text: str) -> dict:
        starting_time = datetime.datetime.now()
        text = self.preprocess_text(text)
        classifications = self._get_classifications(name, text)        
        ending_time = datetime.datetime.now()
        classification_elapsed_time = ending_time - starting_time
        classification_elapsed_time_ms = round(classification_elapsed_time.total_seconds() * 1000)
        return {
            "algorithm": { "name": name },
            "process_time": classification_elapsed_time_ms,
            "classifications": classifications,
            "date": datetime.datetime.now() 
        }


    #
    # PRIVATE METHODS.
    #

    def _get_classifications(self, name: str, text: str) -> dict:
        algorithm = algorithms.find_algorithm(name)
        algorithm_type = algorithm["type"]
        if algorithm_type == "text_binary_classification":
            return self._classify_as_text_binary_classification(algorithm, text)            
        raise Exception(f'Algorithm type "{algorithm_type}" is not recognized.')


    def _classify_as_text_binary_classification(self, algorithm: dict, text: str) -> dict:
        result = {}
        categories = algorithm["classifiers"].keys()
        for category in categories:
            classifier = algorithm["classifiers"][category]
            prediction = classifier.predict([text])[0]
            result[category] = prediction  == 1
        return result


    def preprocess_text(self, text: str) -> str:
        text = text.lower()
        # Remove punctuation
        text = "".join([i for i in text if i not in string.punctuation])

        # Remove anything but alphanumeric words.
        text = text.replace('ñ', 'ni')
        text = re.sub(r'\W', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()

        # Remove accents:
        text_nfkd_form = unicodedata.normalize('NFKD', text)
        text = u"".join([c for c in text_nfkd_form if not unicodedata.combining(c)])

        # Remove stopwords
        # TO DO: ADD THIS.
        text_words = text.split(' ')
#        stop_words = nltk.corpus.stopwords.words('spanish')
#        text_words = [i for i in text_words if i not in stop_words]
    
        # Remove very long words, they must be OCR errors.
        text_words = [i for i in text_words if len(i) < 15]
        
        # Remove single chars text words.
        text_words = [i for i in text_words if len(i) > 1]
        return " ".join(text_words)