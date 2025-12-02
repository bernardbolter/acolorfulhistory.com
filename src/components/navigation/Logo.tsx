'use client'

import { useHistory } from "@/providers/HistoryProvider"
import ColorLogo from '@/svg/colorLogo'
import { useTranslations } from "next-intl"

const Logo = () => {
    const [ history ] = useHistory()
    const t = useTranslations()

    return (
        <div className={history.navOpen ? 'logo logo-menu-open' : 'logo'}>
            <ColorLogo />
            <p className='logo-tageline'>{t('paintingPhotographyAndHistory')}</p>
            <p className="logo-tageline-name">{t('by')} <b>Bernard Bolter</b></p>
        </div>
    )
}

export default Logo