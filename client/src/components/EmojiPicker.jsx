import React, { useState, useEffect } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { init, getEmojiDataFromNative } from 'emoji-mart'

init({ data })

const EmojiPicker = props => {
  const [selectedEmoji, setSelectedEmoji] = useState()
  const [isShowPicker, setIsShowPicker] = useState(false)

  useEffect(() => {
    setSelectedEmoji(props.icon)
  }, [props.icon])

  const selectEmoji = (e) => {
    const sym = e.unified.split('-')
    let codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    const emoji = String.fromCodePoint(...codesArray)
    setIsShowPicker(false)
    props.onChange(emoji)
  }

  const showPicker = () => setIsShowPicker(!isShowPicker)

  return (
    <div className='relative w-max text-3xl text-bold cursor-pointer' onClick={showPicker}>
      {selectedEmoji}
      {isShowPicker && (<div className="absolute top-[100%] z-50">
        <Picker data={data} theme='dark' onEmojiSelect={selectEmoji} showPreview={false} />
      </div>)}
    </div>
  )
}

export default EmojiPicker