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
    const topics = await fectchTopics();
    const sortedDate = topics.sort((a, b) => b.discussedOn - a.discussedOn);
    const html = sortedDate.map(topic => {
        if (topic.discussedOn === "") {
            const html =
             `
                <li data-id=${topic.id}>
                    <h3>${topic.title}</h3>
                    <button class="archive"></button>
                    <div class="up_down_votes">
                        <button data-id="${topic.id}" class="upvotes"></button>
                        <p>${topic.upvotes}</p>
                        <button data-id="${topic.id}" class="downvotes"></button>
                        <p>${topic.downvotes}</p>
                    </div>
                </li>
            `
            nextTopics.innerHTML += html;
        }

        else {
            const html =
             `
                <li data-id=${topic.id}>
                    <h3>${topic.title}</h3>
                    <p class="discussed">${topic.discussedOn}</p>
                    <button data-id="${topic.id}" class="delete"></button>
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
        title: topicTitle,
        id: Date.now(),
        downvotes: 0,
        upvotes: 0,
    }
    topics.push(newTopic);
    console.log(topics);
    displayTopics(newTopic);
    form.reset();
    container.dispatchEvent(new CustomEvent('storeTopics'));
}

function handleClick(e) {
    if (e.target.closest('.delete')) {
        let liElement = e.target.closest('li');
        const deleteBtn = liElement.querySelector('button.delete') 
        const id = deleteBtn.dataset.id;
        deleteTopic(id);
    }
    if (e.target.closest('.upvotes')) {
        const closer = e.target.closest('li');
        const button = closer.querySelector('button.upvotes');
        const id = button.dataset.id;
        upvotesBtn(id);
    }
    if (e.target.closest('.downvotes')) {
        const button = e.target.closest('.downvotes');
        console.log(button);
        const id = button.dataset.id;
        downvoteBtn(id);
    }
}

function upvotesBtn(idToUp) {
    console.log(idToUp, 'upvotes');
    const topic = topics.find(topic => topic.id === idToUp)
    topic.upvotes++;
    container.dispatchEvent(new CustomEvent('storeTopics'));
}

function downvoteBtn(idToUp) {
    console.log(idToUp, 'downvotes');
    const topic = topics.find(topic => topic.id === idToUp)
    topic.downvotes++;
    container.dispatchEvent(new CustomEvent('storeTopics'));
}

function deleteTopic(idTodelete) {
    console.log(idTodelete, 'deleted');
    topics = topics.filter(topic => topic.id !== idTodelete);
    container.dispatchEvent(new CustomEvent('storeTopics'));
}

form.addEventListener('submit', handleSubmit);
container.addEventListener('storeTopics', displayTopics);
container.addEventListener('storeTopics', updateLocalStorage);
container.addEventListener('click', handleClick);

displayTopics()
initLocalStorage();