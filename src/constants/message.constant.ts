export const ERROR_MESSAGE = {
  AUTH: {
    NOT_VERIFIED_EMAIL: '이메일 인증이 완료되지 않았습니다.',
    NOT_FOUND_USER: '존재하지 않는 계정입니다.',
    NOT_FOUND_TERMS: '약관정보가 없습니다.',
    ALREADY_EMAIL_EXISTS: '이미 존재하는 이메일입니다.',
    UNKNOWN: '인증에 문제가 발생했습니다.',
  },
} as const;

export const SUCCESS_MESSAGE = {
  AUTH: {
    SEND_VERIFICATION_EMAIL: '인증 이메일이 전송되었습니다.',
    AVAILABLE_USE_EMAIL: '사용 가능한 이메일입니다.',
    LOGIN: '로그인 성공했습니다.',
    SIGNUP: '회원가입 성공했습니다.',
  },
} as const;

export const ERROR_REGEX_MESSAGE = {
  PHONE_REGEX: '휴대폰번호 형식이 올바르지 않습니다.',
} as const;
