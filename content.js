

async function generateEmailSubject(emailBodyText) {
    const apiKey = await getApiKey();
    const prompt = `Genere un objet pour cet email : "${emailBodyText}" en moins de 100 caracteres et sans dire Objet :.`;
    
    if (!apiKey) {
      console.error('Clé API non définie');
      return;
    }
    
    console.log("Prompt: ", prompt);


    return new Promise(async (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        'https://api.openai.com/v1/chat/completions',
        true
      );
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.setRequestHeader('Authorization', `Bearer ${apiKey}`);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const subject = response.choices[0].message.content
            console.log("Generated subject: ", response);
            resolve(subject);
          } else {
            console.error('Error generating email subject:', xhr.status);
            reject('Objet généré automatiquement (erreur)');
          }
        }
      };
      xhr.send(
        JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{content: prompt, role: 'user'}],
            max_tokens: 512, // Augmente la longueur maximale de l'objet généré
            n: 1, 
            stop: null, 
            temperature: 0.3
        })
      );
    });
  }
  
  
  
  let timeoutId = null;
  
  async function onBodyChange() {
    clearTimeout(timeoutId);
    const emailBodyText = getEmailBody().innerText.trim().replace(/(\r\n|\n|\r)/gm, ' ');
    timeoutId = setTimeout(async () => {
      const generatedSubject = await generateEmailSubject(emailBodyText);
      setEmailSubject(generatedSubject);
    }, 2000);
  }
  
  function getEmailBody() {
    return document.querySelector('div[aria-label="Corps du message"], div[aria-label="Message Body"]');
  }
  
  async function addListenerToEmailBody() {
    const emailBody = getEmailBody();
    if (emailBody) {
      try {
        emailBody.addEventListener('input', onBodyChange);
        console.log('Email body listener added');
      } catch (error) {
        console.error('Error adding email body listener:', error);
      }
    } else {
      console.log('Email body not found. Retrying in 1 second');
      setTimeout(addListenerToEmailBody, 1000);
    }
  }
  
  function setEmailSubject(subject) {
    const subjectInput = document.querySelector('input[name="subjectbox"]');
    if (subjectInput) {
      subjectInput.value = subject;
    } else {
      console.error('Cannot find subject input field');
    }
  }

function getApiKey() {
    return new Promise((resolve) => {
        chrome.storage.sync.get('apiKey', (data) => {
        resolve(data.apiKey);
        });
    });
}
  
  
  
  
  addListenerToEmailBody();
  