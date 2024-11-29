### 1. MongoDB Atlas Connection

Create a file called `.env` in the acoustic_diagnostics directory alongside the `add_audio.py` file and add your atlas connection string, in the following format:

`MONGO_CONNECTION_STRING="mongodb+srv://connectionstringfromatlas"`

### 2. Install Python Modules

In your terminal, navigate to the acoustic_diagnostics directory.

```bash
cd acoustic_diagnostics
```

Then install the required python modules.

```bash
pip install -r requirements.txt
```

### 3. Record Audio Files

Run `python add_audio.py`

Select the audio input by typing the relevant number and then press enter. Record each sound in sequence.

> [!TIP]
> We recommend using an external microphone and placing it very close to the fan or audio source.

### 4. Create a Search Index

Go to MongoDB Atlas and create an Atlas Search Index in the **audio** database **sounds** collection and using the content of `searchindex.json`

```
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

### 5. Query the Database

Run `python live_query.py` and place your microphone next to the fan.
