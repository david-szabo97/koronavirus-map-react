import React, { useCallback } from 'react'
import './List.css'

const List = ({ children }) => (
  <div className="List">{children}</div>
)

const ListItem = ({ id, children, onClick, ...props }) => {
  const handleOnClick = useCallback(() => {
    if (!onClick) {
      return
    }

    onClick(id)
  }, [ id, onClick ])

  return (
    <div className="List-Item" onClick={handleOnClick} {...props}>
      {children}
    </div>
  )
}

List.Item = ListItem

export default List
