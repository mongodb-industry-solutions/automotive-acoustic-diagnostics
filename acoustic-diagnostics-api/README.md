# Acoustic Diagnostics API

## Prerequisites

- [FFmpeg](https://ffmpeg.org/download.html)

  - **Usage**: FFmpeg is used for audio processing, specifically to convert and manipulate audio files, which is a crucial part of diagnosing the wind turbine’s condition.
  - **Installation**:
    - **macOS**:
      - Install using Homebrew:
        ```bash
        brew install ffmpeg
        ```

- [wget](https://www.gnu.org/software/wget/)

  - **Usage**: `wget` is used to download the model files that are essential for audio inference in this project.
  - **Installation**:
    - **macOS**:
      - Install using Homebrew:
        ```bash
        brew install wget
        ```

## Create an Atlas Search Index

Go to MongoDB Atlas and create an Atlas Search Index in the demo database you created in [Step 2](../README.md#step-2---set-up-mongodb-atlas). This index should be created in the `sounds` collection and using the content of [utils/indexes/search_index.json](../utils/indexes/search_index.json).

```json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "emb": {
        "dimensions": 2048,
        "similarity": "cosine",
        "type": "knnVector"
      }
    }
  }
}
```

## Install the python dependencies

1. Create a virtual environment:
   ```bash
   python3 -m venv .venv
   ```
2. Activate the virtual environment:
   ```bash
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   python3 -m pip install -r requirements.txt
   ```
4. Download the PANNs model checkpoint file and move it to the correct path:
   ```bash
   wget https://zenodo.org/record/3987831/files/Cnn14_mAP%3D0.431.pth?download=1 -O Cnn14_mAP=0.431.pth
   mv Cnn14_mAP=0.431.pth ~/panns_data
   ```

## Run the diagnostics API

Update the environment variables, you can create a `.env` file from the `EXAMPLE.env` file provided.

```
cp EXAMPLE.env .env
```

Once you have updated the environment variables with your own values, simply run the command below in your terminal.

```bash
uvicorn main:app --reload --port 8000
```

---

And that's it! If you have followed all the steps above, you are now ready to proceed to [Step 4 - Integrate AWS Bedrock for AI-enhanced analytics](../README.md#step-4---integrate-aws-bedrock-for-ai-enhanced-analytics).
