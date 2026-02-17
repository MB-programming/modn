const TEMPLATES = {
    'wida-one': {
        imgId: 'img-wida-one',
        fontScale: 0.12,
        nameX: 0.5,
        nameY: 0.84,
        fontColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowBlur: 20
    },
    'wida-two': {
        imgId: 'img-wida-two',
        fontScale: 0.09,
        nameX: 0.5,
        nameY: 0.71,
        fontColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowBlur: 25
    }
};

let selectedTemplate = 'wida-one';

function selectTemplate(template) {
    selectedTemplate = template;

    document.querySelectorAll('.template-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    document.querySelector(`[data-template="${template}"]`).classList.add('selected');
}

function generateCard() {
    const name = document.getElementById('name-input').value.trim();

    if (!name) {
        const input = document.getElementById('name-input');
        input.focus();
        input.style.borderColor = '#ef4444';
        setTimeout(() => input.style.borderColor = '', 2000);
        return;
    }

    const config = TEMPLATES[selectedTemplate];
    const img = document.getElementById(config.imgId);
    const canvas = document.getElementById('result-canvas');
    const ctx = canvas.getContext('2d');

    // Wait for image to load
    const render = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const fontSize = Math.floor(canvas.height * config.fontScale);
        ctx.font = `700 ${fontSize}px WidaFont, sans-serif`;
        ctx.fillStyle = config.fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowColor = config.shadowColor;
        ctx.shadowBlur = config.shadowBlur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillText(name, canvas.width * config.nameX, canvas.height * config.nameY);

        // Show step 2
        document.getElementById('step1').classList.remove('active');
        document.getElementById('step2').classList.add('active');
    };

    if (img.complete && img.naturalWidth > 0) {
        render();
    } else {
        img.onload = render;
    }
}

function downloadCard() {
    const canvas = document.getElementById('result-canvas');
    const name = document.getElementById('name-input').value.trim();

    canvas.toBlob(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `wida-ramadan-${selectedTemplate}-${name || 'card'}.jpg`;
        link.click();
        URL.revokeObjectURL(link.href);
    }, 'image/jpeg', 0.95);
}

function goBack() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
}

// Enter key to generate
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('name-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') generateCard();
    });
});
