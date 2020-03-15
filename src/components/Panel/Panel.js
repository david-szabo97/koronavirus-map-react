import React from 'react'
import './Panel.css'

const Panel = ({ title, subtitle, children, containerClass, subtitleStyle }) => (
  <div className={`Panel ${containerClass || ''}`}>
    <div className="Panel-Title">{title}</div>
    <div className="Panel-SubTitle" style={subtitleStyle}>{subtitle}</div>

    <div className="Panel-Scroller">
     <div className="Panel-Body">
       {children}
     </div>
    </div>
  </div>
)

export default Panel