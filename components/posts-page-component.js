import { USER_POSTS_PAGE, POSTS_PAGE } from '../routes.js'
import { renderHeaderComponent } from './header-component.js'
import { posts, goToPage, getToken,renderApp } from '../index.js'
import { getPosts, putLike } from '../api.js'
import {formatDistanceToNow} from '../node_modules/date-fns/formatDistanceToNow.js'

export function renderPostsPageComponent({ appEl }) {
    

    // @TODO: реализовать рендер постов из api
    console.log('Актуальный список постов:', posts)
    /**
     * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
     * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
     */
    //let usersPosts = posts.filter(postUserId =>  postUserId.user.id === '6421860c32e0301869fb3301')
    //console.log(usersPosts);
    let listOfPosts = posts
        .map((post, index) => {
          let formatedCreatedAt = formatDistanceToNow(post.createdAt)
            return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-postid="${post.id}" class="like-button">
            <img data-likeimg=${post.isLiked} src=${
                post.isLiked
                    ? './assets/images/like-active.svg'
                    : './assets/images/like-not-active.svg'
            }>
          </button>
          <p class="post-likes-text">
            Нравится: <strong id='likes-${post.id}'>${
                post.likes.length
            }</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
        ${formatedCreatedAt} назад
        </p>
      </li>`
        })
        .join('')

    const appHtml = `
      <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
      ${listOfPosts}
      </ul>
    </div>`

    appEl.innerHTML = appHtml

    renderHeaderComponent({
        element: document.querySelector('.header-container'),
    })

    for (let userEl of document.querySelectorAll('.post-header')) {
        userEl.addEventListener('click', () => {
            goToPage(USER_POSTS_PAGE, {
                userId: userEl.dataset.userId,
            })
        })
    }
    for (let likeEl of document.querySelectorAll('.like-button')) {
        //likeInitListener(likeEl)
        likeEl.addEventListener('click', () => {
          let like = likeEl.dataset.postid
          let likeImg = likeEl.getElementsByTagName('img')
          let status = posts.filter((post) => post.id === like)[0].isLiked
          let likesNumber = document.getElementById(`likes-${like}`)
            putLike(like, status).then((data) => {
                
                //console.log(data.post.isLiked, status,data.post.likes.length)
                likeImg[0].src = data.post.isLiked
                    ? './assets/images/like-active.svg'
                    : './assets/images/like-not-active.svg'
                  likesNumber.innerText = data.post.likes.length
                //getPosts({token: getToken()})
                //renderPostsPageComponent({ appEl })
                // status = data.post.isLiked
                // console.log(likeImg[0].src, status, )

                goToPage(POSTS_PAGE)
    
              
            })
        })
        
    }
   
}

export let likeInitListener = (likeEl) => {
   
    
}
