import React from "react";

import { useNavigate } from "react-router-dom";
import { Stack } from "components/Stack";
import { Image } from "components/Image";
import { Column } from "components/Column";
import { Text } from "components/Text";
import { Button } from "components/Button";

const LoginPagePage = () => {
  const navigate = useNavigate();

  const handleNavigate20 = () => navigate("/");
  const handleNavigate19 = () => navigate("/registerpage");

  return (
    <>
      <Stack className="bg-white_A700 font-nunitosans h-[1019.2px] 2xl:h-[1020px] 3xl:h-[1224px] lg:h-[793px] xl:h-[907px] mx-[auto] w-[100%]">
        <Image
          src="img_image1.png"
          className="absolute bottom-[0] lg:h-[1027px] xl:h-[1175px] h-[1320px] 2xl:h-[1321px] 3xl:h-[1585px] object-cover w-[100%]"
          alt="image1"
        />
        <Column className="absolute bg-bluegray_200 h-[max-content] inset-[0] items-start justify-center m-[auto] rounded-radius40 w-[69%]">
          <Column className="items-center 3xl:mt-[106px] lg:mt-[69px] xl:mt-[79px] mt-[89px] w-[100%]">
            <Image
              src="img_minervalogo1_1.png"
              className="common-pointer lg:h-[105px] xl:h-[121px] h-[135px] 2xl:h-[136px] 3xl:h-[163px] mx-[auto] object-contain w-[47%]"
              onClick={handleNavigate20}
              alt="MINERVALOGO1"
            />
          </Column>
          <Text className="font-normal lg:mt-[45px] xl:mt-[52px] mt-[59px] 3xl:mt-[70px] lg:mx-[54px] xl:mx-[62px] mx-[70px] 3xl:mx-[84px] not-italic lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-gray_901 text-left">{`Username or email`}</Text>
          <Text className="bg-gray_100 border border-bluegray_100 border-solid font-normal lg:leading-lh28 xl:leading-lh32 2xl:leading-lh36 leading-lh3600 3xl:leading-lh43 lg:mt-[4px] xl:mt-[5px] mt-[6px] 3xl:mt-[7px] lg:mx-[54px] xl:mx-[62px] mx-[70px] 3xl:mx-[84px] not-italic lg:pl-[12px] xl:pl-[14px] pl-[16px] 3xl:pl-[19px] lg:py-[14px] xl:py-[16px] py-[18.5px] 2xl:py-[18px] 3xl:py-[22px] rounded-radius12 text-bluegray_500 lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-left w-[86%]">{`Enter username or email`}</Text>
          <Text className="font-normal lg:mt-[17px] xl:mt-[20px] mt-[23px] 3xl:mt-[27px] lg:mx-[54px] xl:mx-[62px] mx-[70px] 3xl:mx-[84px] not-italic lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-gray_901 text-left">{`Password`}</Text>
          <Text className="bg-gray_100 border border-bluegray_100 border-solid font-normal lg:leading-lh28 xl:leading-lh32 2xl:leading-lh36 leading-lh3600 3xl:leading-lh43 lg:mt-[4px] xl:mt-[5px] mt-[6px] 3xl:mt-[7px] lg:mx-[54px] xl:mx-[62px] mx-[70px] 3xl:mx-[84px] not-italic lg:pl-[12px] xl:pl-[14px] pl-[16px] 3xl:pl-[19px] lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius12 text-bluegray_500 lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-left w-[86%]">{`Enter password`}</Text>
          <Button className="font-bold lg:mt-[10px] xl:mt-[12px] mt-[14px] 3xl:mt-[16px] lg:mx-[54px] xl:mx-[62px] mx-[70px] 3xl:mx-[84px] xl:py-[11px] py-[12.5px] 2xl:py-[12px] 3xl:py-[15px] lg:py-[9px] rounded-radius4 text-center lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-light_blue_900 w-[21%]">{`Forgot password?`}</Button>
          <Column className="items-center mb-[104px] 3xl:mb-[124px] lg:mb-[80px] xl:mb-[92px] lg:mt-[31px] xl:mt-[36px] mt-[41px] 3xl:mt-[49px] w-[100%]">
            <Column className="bg-blue_A700 border border-blue_A700 border-solid items-center justify-start mx-[auto] lg:py-[24px] xl:py-[28px] py-[31.5px] 2xl:py-[31px] 3xl:py-[37px] rounded-radius12 w-[91%]">
              <Text className="font-bold mx-[auto] text-center lg:text-fs24 xl:text-fs28 text-fs32 3xl:text-fs38 text-white_A700 tracking-ls1">{`Log in`}</Text>
            </Column>
            <Stack className="lg:h-[54px] xl:h-[62px] h-[69px] 2xl:h-[70px] 3xl:h-[83px] lg:mt-[31px] xl:mt-[36px] mt-[41px] 3xl:mt-[49px] mx-[auto] w-[48%]">
              <Button
                className="common-pointer absolute font-bold lg:py-[2px] py-[3.5px] 2xl:py-[3px] xl:py-[3px] 3xl:py-[4px] right-[12%] rounded-radius4 text-center lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-gray_900 top-[22%] w-[21%]"
                onClick={handleNavigate19}
              >{`Sign up`}</Button>
              <Text className="absolute font-normal h-[max-content] inset-y-[0] left-[0] my-[auto] not-italic text-black_900 text-center lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33">{`Dont’t have an account?`}</Text>
            </Stack>
          </Column>
        </Column>
      </Stack>
    </>
  );
};

export default LoginPagePage;
