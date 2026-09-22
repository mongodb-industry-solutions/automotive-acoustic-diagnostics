# ==========================================
# STAGE 1: Builder (Compile and Download)
# ==========================================
FROM python:3.9-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install build dependencies (gcc needed for some python audio libs)
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc build-essential wget && \
    rm -rf /var/lib/apt/lists/*

# Create a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# The pip shipped with python:3.9-slim (23.0.1) rejects wheels whose metadata
# name differs in case or separator from the requested name - it discards e.g.
# typing_extensions, falls back to the sdist, and then needs a build backend.
RUN pip install --no-cache-dir --upgrade pip

# 1. Install CPU-ONLY Torch (The massive space saver)
# We install this BEFORE requirements to ensure dependencies utilize this version
# The PyTorch index only carries torch and its own builds, so PyPI stays in the
# list as an extra index for the pure-python dependencies (and any build
# backend a source fallback needs). The +cpu local version is published only on
# the PyTorch index, so pinning it keeps the CUDA build on PyPI from winning.
RUN pip install --no-cache-dir \
    torch==2.8.0+cpu torchaudio==2.8.0+cpu \
    --index-url https://download.pytorch.org/whl/cpu \
    --extra-index-url https://pypi.org/simple

# 2. Install the rest of the dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. Pre-download the PANNs model weights
# This forces the download now so we can copy the cached file to the final image
# Default download location is /root/panns_data
RUN python -c "from panns_inference import AudioTagging; model = AudioTagging(checkpoint_path=None, device='cpu')"


# ==========================================
# STAGE 2: Final Runtime Image
# ==========================================
FROM python:3.9-slim AS final

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Install runtime libraries
# libsndfile1 is REQUIRED for librosa to work reliably
# ffmpeg is REQUIRED for pydub/audio processing
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg libsndfile1 && \
    rm -rf /var/lib/apt/lists/*

# Copy the virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Copy the downloaded PANNs model weights from builder
# We place them in the same location /root/panns_data so the library finds them
COPY --from=builder /root/panns_data /root/panns_data

# Copy application code
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
