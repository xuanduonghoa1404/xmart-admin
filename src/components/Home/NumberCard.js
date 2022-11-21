import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
// import iconMap from 'utils/iconMap'
import styles from './numberCard.module.css'


function NumberCard({ icon, color, title, number, countUp }) {
  return (
    <Card
      className={styles.numberCard}
      bordered={false}
      bodyStyle={{ padding: 10 }}
    >
      <span className={styles.iconWarp} style={{ color }}>
        {icon}
      </span>
      <div className={styles.content}>
        <p className={styles.title}>{title || 'No Title'}</p>
        <p className={styles.number}>
          {number}
          {countUp}
        </p>
      </div>
    </Card>
  )
}

NumberCard.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
  number: PropTypes.number,
  countUp: PropTypes.object,
}

export default NumberCard