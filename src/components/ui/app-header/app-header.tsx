import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from '../../../services/store';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => !!state.profile.user);
  const hasAccessToken = document.cookie.includes('accessToken=');
  const isAuth = !!user || hasAccessToken;
  const handleProfileClick = () => {
    if (isAuth) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <BurgerIcon type={'primary'} />
            <NavLink
              to={'/'}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.link_active}` : styles.link
              }
            >
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </NavLink>
          </>
          <>
            <ListIcon type={'primary'} />
            <NavLink
              to={'/feed'}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.link_active}` : styles.link
              }
            >
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </NavLink>
          </>
        </div>
        <div className={styles.logo}>
          <NavLink to={'/'}>
            <Logo className='' />
          </NavLink>
        </div>
        <div
          className={`${styles.link} ${styles.link_position_last}`}
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        >
          <ProfileIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </div>
      </nav>
    </header>
  );
};
