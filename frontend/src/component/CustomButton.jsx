import React from 'react'

function CustomButton({className, content, actionOnClick}) {
  return (
    <div onClick={() => actionOnClick()} className={className}>
        {content}
    </div>
  )
}

export default CustomButton
