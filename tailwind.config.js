module.exports = {
  mode: "jit",
  content: [
    "./src/**/**/*.{js,ts,jsx,tsx,html,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,html,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: { lg: "1120px", xl: "1281px", "2xl": "1441px", "3xl": "1729px" },
    extend: {
      colors: {
        gray_52: "#f7fbff",
        gray_51: "#fffafa",
        blue_A700: "#3164f4",
        black_900_3f: "#0000003f",
        light_blue_900: "#0354a6",
        gray_50: "#fcfcfd",
        black_900_00: "#00000000",
        black_900: "#000000",
        black_901: "#030303",
        blue_900: "#064280",
        gray_900_26: "#12121226",
        gray_500: "#979797",
        gray_901: "#101828",
        gray_902: "#262626",
        gray_900: "#121212",
        bluegray_100: "#d0d5dd",
        orange_500: "#ff9600",
        orange_200: "#e8c381",
        gray_100: "#f2f4f7",
        bluegray_500: "#667085",
        bluegray_200: "#abc1c5",
        bluegray_101: "#d6d6d6",
        indigo_900: "#250074",
        indigo_901: "#020073",
        indigo_700: "#2e42a4",
        white_A700: "#ffffff",
      },
      fontFamily: {
        nunitosans: "Nunito Sans",
        inter: "Inter",
        merriweather: "Merriweather",
        poppins: "Poppins",
        nunito: "Nunito",
      },
      boxShadow: {
        bs: "0px 4px  4px 0px #0000003f",
        bs1: "0px 14px  4px 0px #12121226",
      },
      borderRadius: {
        radius1: "1px",
        radius3: "3px",
        radius4: "4px",
        radius10: "10px",
        radius11: "11px",
        radius12: "12px",
        radius16: "16px",
        radius19: "19px",
        radius20: "20px",
        radius33: "33px",
        radius34: "34px",
        radius40: "40px",
        radius50: "50px",
        radius86: "86px",
        radius89: "89px",
        radius92: "92px",
        radius200: "200px",
      },
      fontSize: {
        fs10: "10px",
        fs12: "12px",
        fs14: "14px",
        fs15: "15px",
        fs16: "16px",
        fs17: "17px",
        fs18: "18px",
        fs19: "19px",
        fs20: "20px",
        fs21: "21px",
        fs24: "24px",
        fs28: "28px",
        fs31: "31px",
        fs32: "32px",
        fs33: "33px",
        fs35: "35px",
        fs36: "36px",
        fs37: "37px",
        fs38: "38px",
        fs40: "40px",
        fs41: "41px",
        fs42: "42px",
        fs46: "46px",
        fs48: "48px",
        fs49: "49px",
        fs53: "53px",
        fs56: "56px",
        fs57: "57px",
        fs60: "60px",
        fs62: "62px",
        fs64: "64px",
        fs71: "71px",
        fs72: "72px",
        fs76: "76px",
        fs80: "80px",
        fs96: "96px",
      },
      letterSpacing: {
        ls1: "-1px",
        ls2: "-2px",
        ls12: "-1.2px",
        ls128: "-1.28px",
      },
      lineHeight: {
        lh3: "3px",
        lh4: "4px",
        lh5: "5px",
        lh12: "12px",
        lh14: "14px",
        lh16: "16px",
        lh17: "17px",
        lh18: "18px",
        lh19: "19px",
        lh20: "20px",
        lh21: "21px",
        lh23: "23px",
        lh24: "24px",
        lh27: "27px",
        lh28: "28px",
        lh31: "31px",
        lh32: "32px",
        lh34: "34px",
        lh36: "36px",
        lh37: "37px",
        lh38: "38px",
        lh39: "39px",
        lh42: "42px",
        lh43: "43px",
        lh44: "44px",
        lh48: "48px",
        lh52: "52px",
        lh57: "57px",
        lh450: "4.50px",
        lh1600: "16.00px",
        lh2300: "23.00px",
        lh2400: "24.00px",
        lh3100: "31.00px",
        lh3200: "32.00px",
        lh3600: "36.00px",
        lh4400: "44.00px",
        lh4800: "48.00px",
        lh10000: "100.00%",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
