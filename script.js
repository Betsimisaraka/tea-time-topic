const endtoint = "https://gist.githubusercontent.com/Pinois/93afbc4a061352a0c70331ca4a16bb99/raw/6da767327041de13693181c2cb09459b0a3657a1/topics.json";

const nextTopics = document.querySelector('.next_topic');
const pastTopics = document.querySelector('.past_topics');
const form = document.querySelector('form');
const container = document.querySelector('.dispalyTopics');

let topics = [];

async function fectchTopics() {
    const response = await fetch(endtoint);
    const data = await response.json();
    topics = data;
    return topics;
}

async function displayTopics() {
    topics = await fectchTopics();
    const sortedDate = topics.sort((a, b) => b.discussedOn - a.discussedOn);
    const html = sortedDate.map(topic => {
        if (topic.discussedOn === "") {
            const html =
             `
                <li data-id=${topic.id}>
                    <h3>${topic.title}</h3>
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
                    <h3>${topic.title}</h3>
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

function initLocalStorage() {
    const topicsFromLs = localStorage.getItem('topics');
    const items = JSON.parse(topicsFromLs); 
    if (items) {
        topics = items;
        container.dispatchEvent(new CustomEvent('storeTopics'));
    } else {
        topics = [];
    }
}

function updateLocalStorage() {
    localStorage.setItem('topics', JSON.stringify(topics))
}

function handleSubmit(e) {
    console.log(e.target);
    e.preventDefault();
    const form = e.target;
    const topicTitle = form.teatopic.value;

    const newTopic = {
        discussedOn: "",
        tille: topicTitle,
        id: Date.now(),
        downvotes: 0,
        upvotes: 0,
    }
    topics.push(newTopic);
    console.log(topics);
    form.reset();
    container.dispatchEvent(new CustomEvent('storeTopics'));
}

form.addEventListener('submit', handleSubmit);

container.addEventListener('storeTopics', displayTopics);
container.addEventListener('storeTopics', updateLocalStorage);

displayTopics();
initLocalStorage();