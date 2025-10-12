import google.generativeai as genai

genai.configure(api_key="AIzaSyB-QhYS03iyBN2AjYnfQxCaqkbR4CkvvAI")  # <-- put your API key here

# Now list models
models = list(genai.list_models())
for m in models:
    print(m)
