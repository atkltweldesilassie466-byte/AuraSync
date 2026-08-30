const webcamElement = document.getElementById('webcam');
const statusText = document.getElementById('status-text');
const tipText = document.getElementById('tip-text');
const bodyBg = document.getElementById('body-bg');

// የካሜራ ፍሰት (Webcam Stream) ማስጀመር
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        webcamElement.srcObject = stream;
        statusText.innerText = "ካሜራው በርቷል! ስሜትዎትን በመቃኘት ላይ...";
        
        // ከጥቂት ሰከንዶች በኋላ የ AI ስሜት መለኪያውን ማስጀመር
        setTimeout(simulateEmotionalAI, 4000);
    } catch (error) {
        console.error("ካሜራውን መክፈት አልተቻለም:", error);
        statusText.innerText = "እባክዎ ለካሜራ ፈቃድ (Permission) ይስጡ።";
    }
}

// የ AI ስሜት ትንተና ማስመሰል (Simulation & Dynamic UI Update)
function simulateEmotionalAI() {
    // ሊሆኑ የሚችሉ ስሜቶች እና የከለር / የምክር አማራጮች
    const moods = [
        {
            state: "የተረጋጋ እና ትኩረት የሰጠ (Focused & Calm)",
            tip: "አዕምሮዎ በጥሩ ሁኔታ ላይ ይገኛል! ይህ ሰዓት ስራዎችን ለመስራት ምርጥ ሰዓት ነው።",
            gradient: "linear-gradient(135deg, #1f4068, #162447)" // ሰማያዊ
        },
        {
            state: "የተጨነቀ ወይም የደከመ (Stressed / Tired)",
            tip: "ትንሽ የውጥረት ስሜት ይታይብዎታል። ጥልቅ ትንፋሽ ውሰዱ እና ለአጭር ደቂቃ ዘና ይበሉ!",
            gradient: "linear-gradient(135deg, #482ff6, #22055a)" // ሐምራዊ / ሮዝ
        },
        {
            state: "ደስተኛ እና ሃልዮ የተሞላበት (Energetic & Happy)",
            tip: "ዛሬ ጉልበትዎ እጅግ ከፍ ያለ ነው! ይህንን አዎንታዊ ሃይል ለፈጠራ ስራዎች ይጠቀሙበት።",
            gradient: "linear-gradient(135deg, #00828a, #004d40)" // አረንጓዴ / ቱርኩዋዝ
        }
    ];

    // በዘፈቀደ አንዱን ስሜት መምረጥ (ለ ላይቭ ማሳያ የሚመች)
    const randomMood = moods[Math.floor(Math.random() * moods.length)];

    // በሰአቱ ልክ የዌብሳይቱን ከለር እና የ AI ምክር መቀየር
    statusText.innerText = `የተገኘው ስሜት: ${randomMood.state}`;
    tipText.innerText = randomMood.tip;
    bodyBg.style.background = randomMood.gradient;

    // በየ 8 ሰከንዱ ስሜቱን አሁንም እያደሰ (Loop) እንዲቀይረው ማድረግ
    setTimeout(simulateEmotionalAI, 8000);
}

// አፕሊኬሽኑ ሲከፈት ካሜራውን ማብራት
setupCamera();