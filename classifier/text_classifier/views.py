from rest_framework.response import Response
from rest_framework.views import APIView

from text_classifier.text_classifiers import Classifiers

text_classifiers = Classifiers()

def get_wrapped_result(result):
    return { "success": True, "payload": result }

def get_wrapped_error(error: Exception):
    error_message = str(error)
    print(f'Error has ocurred: {error_message} ')
    return { "success": False, "error": error_message, "errorCode": "CLASSIFIER_ERROR" }

class TextClassifierView(APIView):
    def post(self, request):
        try:
            name = request.data["name"]
            text = request.data["text"]
            result = text_classifiers.classify(name, text)
            wrapped_result = get_wrapped_result(result)
            return Response(wrapped_result)
        except Exception as e:
            wrapped_error = get_wrapped_error(e)
            return Response(wrapped_error)

class TextClassifierListView(APIView):
    def get(self, request):
        try:
            result = text_classifiers.algorithms.list_algorithms()
            wrapped_result = get_wrapped_result(result)
            return Response(wrapped_result)
        except Exception as e:
            wrapped_error = get_wrapped_error(e)
            return Response(wrapped_error)