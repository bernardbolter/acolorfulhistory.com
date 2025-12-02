import { useMemo } from 'react'

import variables from '@/style/vars.module.scss'
import { decideColor } from '@/helpers/helpers'

const FilterDot = ({ checked }) => {
    const filterColor = useMemo(() => {
        return decideColor(variables)
    }, [])

    return (
        <div
            className="filter-checkbox"
            style={{
                "background" : checked ? filterColor : 'rgba(255,255,255,.2)'
            }}
        />
    )
}

export default FilterDot