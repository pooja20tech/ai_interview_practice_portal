let recorder, audioStream;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

startBtn.onclick = async () => {
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recorder = new MediaRecorder(audioStream);
        
        let chunks = [];
        
        recorder.ondataavailable = e => chunks.push(e.data);

        recorder.onstop = async () => {
            let blob = new Blob(chunks, { type: "audio/wav" });
            let formData = new FormData();
            formData.append("audio_data", blob, "interview.wav");

            try {
                const response = await fetch("/upload_audio", {
                    method: "POST",
                    body: formData
                });

                const result = await response.json();

                // Save result in sessionStorage (for result.html)
                sessionStorage.setItem("emotion", result.emotion);
                sessionStorage.setItem("feedback", result.feedback);
                sessionStorage.setItem("probabilities", JSON.stringify(result.probabilities));

                // Redirect to result page
                window.location.href = "/result";

            } catch (err) {
                alert("Error uploading audio: " + err);
            }
        };
        
        recorder.start();

        startBtn.disabled = true;
        stopBtn.disabled = false;

    } catch (err) {
        alert("Microphone access denied or not available.");
    }
};

stopBtn.onclick = () => {
    if (recorder && recorder.state !== "inactive") {
        recorder.stop();
    }
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;
};
