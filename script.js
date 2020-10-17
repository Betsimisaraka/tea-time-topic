const endtoint = "https://gist.githubusercontent.com/Pinois/93afbc4a061352a0c70331ca4a16bb99/raw/6da767327041de13693181c2cb09459b0a3657a1/topics.json";

const nextTopics = document.querySelector('.next_topic');
const pastTopics = document.querySelector('.past_topics');
const form = document.querySelector('form');


async function fectchTopics() {
    const response = await fetch(endtoint);
    const data = await response.json();
    return data;
}

async function displayTopics() {
    const topicsToDisplay = await fectchTopics();
    const sortedDate = topicsToDisplay.sort((a, b) => b.discussedOn - a.discussedOn);
    const html = sortedDate.map(topic => {
        if (topic.discussedOn === "") {
            const html =
             `
                <li data-id=${topic.id}>
                    <p>${topic.title}</p>
                    <p>${topic.upvotes}</p>
                    <p>${topic.downvotes}</p>
                </li>
            `
            nextTopics.innerHTML += html;
        }

        else {
            const html =
             `
                <li data-id=${topic.id}>
                    <p>${topic.title}</p>
                    <p>${topic.discussedOn}</p>
                    <p>${topic.upvotes}</p>
                    <p>${topic.downvotes}</p>
                </li>
            `
            pastTopics.innerHTML += html;
        }
        
    })
    return html;
}

function handleSubmit(e) {
    console.log(e.target);
    e.preventDefault();
    const form = e.target;
    const topicTitle = form.teatopic.value;

    const newTopic = `
        <li>
            <p>${topicTitle}</p>
        </li>
    
    `
    nextTopics.insertAdjacentHTML('beforeend', newTopic);
}

form.addEventListener('submit', handleSubmit);

displayTopics();
// fectchTopics();