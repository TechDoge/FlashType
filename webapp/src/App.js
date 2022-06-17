import './App.css'
import bolt from './imgs/bolt.png'
import githubLogo from './imgs/githubLogo.png'
import reloadIcon from "./imgs/resetLogo.png"
import React, {useEffect, useState} from 'react'

function App() {

  let words = "the world needs more people like you due to the overwhelming percentage of fatsos living across the united states of america and this fact is not to be ignored because it is vital in order for people to learn about the true needs of our government and democracy"
  words = words.split(" ")
  let wordsTyped = 0
  let currentWord = words[wordsTyped]
  let charsTyped = 0
  let countedChars = "abcdefghijklmnopqrstuvwxyz "
  let startTime = 0
  let timePassed = 0
  let totalTime = 30
  let totalCharsTyped = 0

  function toRGB(hex){
    let r = parseInt(hex.slice(1,3), 16)
    let g = parseInt(hex.slice(3,5), 16)
    let b = parseInt(hex.slice(5,7), 16)
    return "rgb("+r+", "+g+", "+b+")"
  }

  function getWPM(){
    timePassed = new Date().getTime() - startTime
    if (totalCharsTyped === 0 || timePassed === 0)
      return 0
    if (timePassed > totalTime * 1000)
      timePassed = totalTime * 1000
    let allChars = document.getElementsByClassName("letter");
    let right = 0
    let total = 0;
    for (let i = 0; i < allChars.length; i++){
      if (allChars[i].style.color === toRGB(correctColor))
        right++
      else if (allChars[i].style.color === "" || allChars[i].style.color === toRGB(startingColor))
        break
      total++
    }
    let wpm = Math.round(totalCharsTyped / 5 / (timePassed / 60000) * (right / total))
    return wpm
  }

  let startingColor = "#3d485f"
  let correctColor = "#c5c5b0"
  let wrongColor = "#b81b2c"
  let alreadyPaused = false
  function tick(){
    document.querySelector(".wpm").innerHTML = ""+getWPM()
    let timey = document.querySelector('.timePassed')
    timey.innerHTML = Math.round(totalTime - timePassed/1000)
    if (Math.round(totalTime - timePassed/1000) === 0){
      pauseIs=false
      alreadyPaused=false
      pause()
    }
    else
      setTimeout(() => {tick()}, 100)
  }


  const body = document.querySelector('body')
  let typeBox = document.createElement('div')
  if (document.getElementsByClassName('typeBox').length === 0){
    typeBox.classList.add('typeBox')
    body.appendChild(typeBox)
  }else{
    typeBox = document.getElementsByClassName('typeBox')[0]
  }
  let pauseIs = false
  function pause(){
    if (!alreadyPaused){
      typeBox.style.opacity = "0"
      document.querySelector(".carot").style.display = "none"
      document.querySelector(".wpm").style.display = "none"
      document.querySelector(".timePassed").style.display = "none"
      document.querySelector(".end-box").style.display = "flex"
      document.querySelector(".wpm-final").innerHTML = ""+getWPM()
      let allChars = document.getElementsByClassName("letter");
      let right = 0
      let total = 0;
      for (let i = 0; i < allChars.length; i++){
        if (allChars[i].style.color === toRGB(correctColor))
          right++
        else if (allChars[i].style.color === "" || allChars[i].style.color === toRGB(startingColor))
          break
        total++
      }
      document.querySelector(".acc-final").innerHTML = ""+Math.round(right/total*100)+"%"
      document.querySelector(".time-final").innerHTML = totalTime
    }
    alreadyPaused = true

    const gitLogo = document.querySelector('.githubLogo')
    gitLogo.ondragstart = () => { return false }
    gitLogo.style.left = (typeBox.getBoundingClientRect().x + typeBox.getBoundingClientRect().width - gitLogo.getBoundingClientRect().width) + "px"
    document.querySelector('.logo').style.left = typeBox.getBoundingClientRect().x + "px"
    if (!pauseIs)
      setTimeout(() => {pause()}, 100);
  }


  for (let i = 0; i < words.length; i++){
    let word = words[i]
    let wordDiv = document.createElement('div')
    wordDiv.classList.add('word')
    for (let j = 0; j < word.length; j++){
      let letter = document.createElement('span')
      letter.innerHTML = word[j]
      letter.classList.add('letter')
      wordDiv.appendChild(letter)
    }
    typeBox.appendChild(wordDiv)
  }

  let lastCharIndex = 0
  let lastCharTyped = ""

  let midY = 0



  function updateCarot() {
    let carot = document.querySelector('.carot')
    carot.style.opacity = "1"
    let allWords = document.querySelectorAll('.word')
    if (wordsTyped > 0){
      if (allWords[wordsTyped].getBoundingClientRect().y > allWords[wordsTyped-1].getBoundingClientRect().y && midY === 0)
        midY = allWords[wordsTyped].getBoundingClientRect().y
      if (allWords[wordsTyped].getBoundingClientRect().y > midY && midY !== 0){
        typeBox.scrollTop = typeBox.scrollTop + (allWords[wordsTyped].getBoundingClientRect().y - midY)
        setTimeout(() => {carot.style.top = `${allWords[wordsTyped].getBoundingClientRect().y}px`}, 125)
      }else{
        carot.style.top = `${allWords[wordsTyped].getBoundingClientRect().y}px`
      }
    }
    if (charsTyped <= 0){
      carot.style.left = `${allWords[wordsTyped].getBoundingClientRect().x-2}px`
    }
    else{
      carot.style.left = `${allWords[wordsTyped].getElementsByTagName('span')[charsTyped-1].getBoundingClientRect().x+allWords[wordsTyped].getElementsByTagName('span')[charsTyped-1].getBoundingClientRect().width-2}px`  
      allWords[wordsTyped].getElementsByTagName('span')[charsTyped-1].style.color = correctColor
    }
    if (charsTyped < lastCharIndex)
      allWords[wordsTyped].getElementsByTagName('span')[charsTyped].style.color = startingColor
    else if (lastCharTyped !== "" && currentWord[lastCharIndex] !== lastCharTyped && allWords[wordsTyped].getElementsByTagName('span')[charsTyped-1] !== undefined){
      allWords[wordsTyped].getElementsByTagName('span')[charsTyped-1].style.color = wrongColor
    }else if (allWords[wordsTyped].getElementsByTagName('span')[charsTyped-1] === undefined && wordsTyped > 0){
      for (let i = 0; i < allWords[wordsTyped-1].getElementsByTagName('span').length; i++){
        allWords[wordsTyped-1].getElementsByTagName('span')[i].style.color = wrongColor
      }
    }
    lastCharIndex = charsTyped

    if (charsTyped === 0 && wordsTyped > 0){
      for (let i = 0; i < allWords[wordsTyped-1].getElementsByTagName('span').length; i++){
        if (allWords[wordsTyped-1].getElementsByTagName('span')[i].style.color === "" || allWords[wordsTyped-1].getElementsByTagName('span')[i].style.color === toRGB(startingColor))
          allWords[wordsTyped-1].getElementsByTagName('span')[i].style.color = "#b81b2c"
      }
    }

 }
 
  function startCarot() {
    document.querySelector('.logo').style.left = typeBox.getBoundingClientRect().x + "px"
    const img = document.querySelector('.bolt')
    img.ondragstart = () => { return false }
    const gitLogo = document.querySelector('.githubLogo')
    gitLogo.ondragstart = () => { return false }
    gitLogo.style.left = (typeBox.getBoundingClientRect().x + typeBox.getBoundingClientRect().width - gitLogo.getBoundingClientRect().width) + "px"
    let wpmCounter = document.querySelector('.wpm')
    wpmCounter.style.left = (typeBox.getBoundingClientRect().x) + "px"
    wpmCounter.style.top = (typeBox.getBoundingClientRect().y-12-wpmCounter.getBoundingClientRect().height) + "px"
    let timey = document.querySelector('.timePassed')
    timey.innerHTML = totalTime
    timey.style.left = (typeBox.getBoundingClientRect().x) + "px"
    timey.style.top = (typeBox.getBoundingClientRect().y-12-timey.getBoundingClientRect().height) + "px"
    let carot = document.querySelector('.carot')
    carot.style.background = "#495772"
    let allWords = document.querySelectorAll('.word')
    carot.style.top = `${allWords[wordsTyped].getBoundingClientRect().y}px`
    carot.style.left = `${allWords[wordsTyped].getElementsByTagName('span')[charsTyped].getBoundingClientRect().x-2}px`
  }

  function hideCarot(){
    let carot = document.querySelector('.carot')
    carot.style.background = "transparent"
  }

  function showCarot(){
    let carot = document.querySelector('.carot')
    carot.style.background = "#495772"
  }

  setTimeout(() => {startCarot()}, 10)
  
  window.addEventListener('resize', () => {
    if (wordsTyped === 0 && charsTyped === 0)
      startCarot()
    else
      updateCarot()
    hideCarot()
    setTimeout(() => {showCarot()}, 300)
  })

  body.addEventListener('keydown', (e) => {

    if (e.key === " " && charsTyped === 0)
      return

    if (countedChars.includes(e.key)) {
      if (startTime === 0){
        startTime = new Date().getTime()
        tick()
      }
      lastCharTyped = e.key
      if (currentWord.length > charsTyped)
        charsTyped++
        totalCharsTyped++
      if (wordsTyped === 0)
        document.querySelector('.carot').style.animation = "none"
      if (e.key === " "){
        charsTyped = 0
        wordsTyped++
      }
      updateCarot()
    }
    
    if (e.key === " "){
      lastCharTyped = ""
      currentWord = words[wordsTyped]
    }else if (e.key === "Backspace"){
      lastCharTyped = ""
      charsTyped--
      totalCharsTyped--
      if (charsTyped < 0){
        charsTyped = 0
      }
      else{
        updateCarot(); 
      }
    }
  })

  function reset(){
    let allWords = document.querySelectorAll('.word')
    typeBox.style.opacity = "1"
    pauseIs = true
    document.querySelector(".carot").style.display = "block"
    document.querySelector(".wpm").style.display = "block"
    document.querySelector(".timePassed").style.display = "block"
    document.querySelector(".end-box").style.display = "none"
    for (let i = 0; i < allWords.length; i++){
      for (let j = 0; j < allWords[i].innerText.length; j++){
        allWords[i].getElementsByTagName('span')[j].style.color = startingColor
      }
    }
    words = "the world needs more people like you due to the overwhelming percentage of fatsos living across the united states of america and this fact is not to be ignored because it is vital in order for people to learn about the true needs of our government and democracy"
    words = words.split(" ")
    typeBox.innerHTML = ""
    for (let i = 0; i < words.length; i++){
      let word = words[i]
      let wordDiv = document.createElement('div')
      wordDiv.classList.add('word')
      for (let j = 0; j < word.length; j++){
        let letter = document.createElement('span')
        letter.innerHTML = word[j]
        letter.classList.add('letter')
        wordDiv.appendChild(letter)
      }
      typeBox.appendChild(wordDiv)
    }
    wordsTyped = 0
    currentWord = words[wordsTyped]
    charsTyped = 0
    startTime = 0
    timePassed = 0
    totalCharsTyped = 0
    document.querySelector(".wpm").innerHTML = "0"
    startCarot()
  }

  return (
      <div className="app">
        <div className="logo">
          <img src={bolt} className="bolt" alt="logo" />
          <div className="title">FlashType</div>
        </div>
        <img className="githubLogo" src={githubLogo} onClick={() => {window.open("https://github.com/TechDoge/FlashType")}} alt="github logo" />
        <div className="wpm">0</div>
        <div className="timePassed">0</div>
        <div className="carot"></div>
        <div className="end-box" style={{display: "none"}}>
          <div>
            <div className="wpm-title">WPM</div>
            <div className="wpm-final">0</div>
          </div>
          <div>
            <div className="acc-title">ACCURACY</div>
            <div className="acc-final">100%</div>
          </div>
          <div>
            <div className="time-title">TIME</div>
            <div className="time-final">30s</div>
          </div>
          <div className="reset-button" onClick={() => {reset()}}><img src={reloadIcon}></img></div>
        </div>
      </div>
  )
}

export default App
