from fastapi import FastAPI
from models.request_model import TextRequest
from services.translator_service import translate_to_english
from services.symptom_service import extract_combined_symptoms
from utils.text_cleaner import clean_text

app = FastAPI()


@app.post("/extract")
async def extract_symptoms(request: TextRequest):
    original_text = request.text
    cleaned_text = clean_text(original_text)
    translated = translate_to_english(cleaned_text)

    results = extract_combined_symptoms(cleaned_text, translated)
    print("✅ original:", original_text)
    print("✅ cleaned:", cleaned_text)
    print("✅ translated:", translated)
    print("✅ results:", results)
    return {
        "original": original_text,
        "cleaned": cleaned_text,
        "translated": translated,
        "results": results,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host="0.0.0.0", port=8002, reload=True)
