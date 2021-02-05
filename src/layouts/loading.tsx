import React from 'react'
import './loading.sass'

const loading: React.FC = () => {
  return (
    <div className="page-loading">
      <h1>能力开放平台</h1>
      <div className="starting" id="starting">
        <div className="spinners">
          <div className="sk-folding-cube">
            <div className="sk-cube1 sk-cube"></div>
            <div className="sk-cube2 sk-cube"></div>
            <div className="sk-cube4 sk-cube"></div>
            <div className="sk-cube3 sk-cube"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default loading