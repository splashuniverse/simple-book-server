/**
 *  AUTH
 */
export enum AUTH_PROVIDER {
  EMAIL = 'email',
  PHONE = 'phone',
  NAVER = 'naver',
  KAKAO = 'kakao',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export enum THEME {
  SYSTEM = 'system',
  LIGHT = 'light',
  DARK = 'dark',
}

export enum LOGIN_LOG_TYPE {
  LOGIN = 'login',
  AUTO_LOGIN = 'auto_login',
  LOGOUT = 'logout',
}

/**
 * PLACE
 */
export enum PLACE_STATUS {
  WAITING = '대기',
  IN_PROGRESS = '진행중',
  COMPLETED = '완료',
}

/**
 * RESERVATION
 */
export enum RESERVATION_STATUS {
  REQUESTED = '예약요청',
  APPROVED = '예약승인',
  REJECT = '예약거절',
  WAITING = '입장대기',
  COMPLETED = '입장완료',
  CANCEL = '예약취소',
}

/**
 * NOTIFICATION
 */
export enum NOTIFICATION_TYPE {
  FCM = '푸시알림',
  EMAIL = '이메일',
  SMS = '문자',
}

export enum NOTIFICATION_STATUS {
  INPROGRESS = '진행중',
  FAIL = '실패',
  SUCCESS = '성공',
}
