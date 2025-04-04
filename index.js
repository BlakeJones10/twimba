import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', (e) => {
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like); 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet);
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply);
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick();
    }
    else if (e.target.dataset.replyBtn) {
        handleReplyInput(e.target.dataset.replyBtn);
    } 
    else if (e.target.dataset.deleteBtn) {
        deleteReply(e.target.dataset.deleteBtn);
    }
});

function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter((tweet) => {
        return tweet.uuid === tweetId;
    })[0];

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--;
    }
    else{
        targetTweetObj.likes++;
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    render();
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter((tweet) =>{
        return tweet.uuid === tweetId;
    })[0];
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--;
    }
    else{
        targetTweetObj.retweets++;
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    render();
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input');

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        });
        render();
        tweetInput.value = '';
    }
}

function handleReplyInput(tweetId){
    const replyInput = document.getElementById(`reply-input-${tweetId}`);
    const replyText = replyInput.value;
    if (replyText){
        const targetTweetObj = tweetsData.filter((tweet) => {
            return tweet.uuid === tweetId;
        })[0];
        
        targetTweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyText,
        });
        targetTweetObj.showReplies = !targetTweetObj.showReplies;
        render();
        replyInput.value = '';
    }

}

function deleteReply(tweetId){
    const targetTweetObj= tweetsData.filter((tweet) => {
        return tweet.uuid === tweetId;
    }
    )[0];
    const targetReply = targetTweetObj.replies.filter((reply) => {
        return reply.uuid === tweetId;
    })[0];
    const targetReplyIndex = targetTweetObj.replies.indexOf(targetReply);
    targetTweetObj.replies.splice(targetReplyIndex, 1);
    render();
}

function getFeedHtml(){
    let feedHtml = ``;
    
    tweetsData.forEach((tweet) => {
        
        let likeIconClass = tweet.isLiked ? 'liked' : '';
        
        let retweetIconClass = tweet.isRetweeted ? 'retweeted' : '';
    
        let repliesHtml = '';
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach((reply) => {
                repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`;
            });
        }
                  
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="${tweet.showReplies ? '' : "hidden"}" id="replies-${tweet.uuid}">
        ${repliesHtml}
        <div class="tweet-reply">
            <input class="reply" id="reply-input-${tweet.uuid}" type="text" placeholder="Reply...">
            <button class="reply-btn" data-reply-btn="${tweet.uuid}">Reply</button>
            <button class="delete-btn" data-delete-btn="${tweet.uuid}">Delete Reply</button>
    </div>

</div>
`;
   });
   return feedHtml;
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml();
}

render();

