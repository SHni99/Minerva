import React from "react";

import { useNavigate } from "react-router-dom";
import NavBar from "components/NavBar";
import { Column } from "components/Column";
import { Row } from "components/Row";
import { Image } from "components/Image";
import { Button } from "components/Button";
import { Text } from "components/Text";
import { Stack } from "components/Stack";
import { Line } from "components/Line";

const ListingsPagePage = () => {
  const navigate = useNavigate();

  const handleNavigate11 = () => navigate("/");
  const handleNavigate10 = () => navigate("/aboutuspage");

  return (
    <div>
      <NavBar />
      <Column className="bg-white_A700 font-nunitosans items-center justify-end mx-[auto] w-[100%]">
        <Column className="bg-gray_52 font-inter items-center justify-center mx-[auto] rounded-radius33 shadow-bs w-[83%]">
          <Column className="items-center justify-start lg:mt-[24px] xl:mt-[27px] mt-[31px] 3xl:mt-[37px] w-[100%]">
            <Row className="items-center justify-center mx-[auto] w-[40%]">
              <Text className="font-medium font-nunito text-black_900 lg:text-fs37 xl:text-fs42 text-fs48 3xl:text-fs57 text-left">{`I’m looking for a`}</Text>
              <Button className="font-inter font-medium 3xl:ml-[10px] lg:ml-[7px] xl:ml-[8px] ml-[9px] py-[-4px] 3xl:py-[-5px] 2xl:py-[-5px] rounded-radius4 text-center lg:text-fs37 xl:text-fs42 text-fs48 3xl:text-fs57 text-indigo_700 w-[25%]">{`Tutor`}</Button>
            </Row>
            <Row className="items-start justify-start lg:mt-[19px] xl:mt-[22px] mt-[25px] 3xl:mt-[30px] w-[100%]">
              <Image
                src="img_inputtext.svg"
                className="lg:h-[39px] xl:h-[45px] h-[50px] 2xl:h-[51px] 3xl:h-[61px] lg:ml-[129px] xl:ml-[148px] ml-[167px] 3xl:ml-[200px] lg:mt-[6px] xl:mt-[7px] mt-[8px] 3xl:mt-[9px] object-contain rounded-radius3 w-[61%]"
                alt="Inputtext"
              />
              <Button className="bg-light_blue_900 border border-light_blue_900 border-solid font-medium mb-[11px] 3xl:mb-[13px] lg:mb-[8px] xl:mb-[9px] ml-[11px] 3xl:ml-[13px] lg:ml-[8px] xl:ml-[9px] lg:mt-[5px] xl:mt-[6px] mt-[7px] 3xl:mt-[8px] xl:py-[10px] py-[12px] 3xl:py-[14px] lg:py-[9px] rounded-radius10 text-center lg:text-fs12 xl:text-fs14 text-fs16 3xl:text-fs19 text-white_A700 w-[11%]">{`Search`}</Button>
            </Row>
          </Column>
          <Stack className="3xl:h-[1115px] lg:h-[722px] xl:h-[826px] h-[928px] 2xl:h-[929px] lg:mb-[15px] xl:mb-[17px] mb-[20px] 3xl:mb-[24px] lg:mt-[19px] xl:mt-[22px] mt-[25px] 3xl:mt-[30px] mx-[auto] w-[83%]">
          </Stack>
        </Column>
        <footer className="font-inter lg:mt-[30px] xl:mt-[34px] mt-[39px] 3xl:mt-[46px] w-[100%]">
          <Column className="items-center justify-start lg:mt-[22px] xl:mt-[25px] mt-[29px] 3xl:mt-[34px] w-[100%]">
            <Line className="h-[2px] mx-[auto] w-[83%]" />
            <Row className="bg-orange_200 items-center justify-start lg:mt-[22px] xl:mt-[25px] mt-[29px] 3xl:mt-[34px] w-[100%]">
              <Text className="font-normal lg:leading-lh12 xl:leading-lh14 2xl:leading-lh16 leading-lh1600 3xl:leading-lh19 lg:mb-[10px] xl:mb-[12px] mb-[14px] 3xl:mb-[16px] lg:ml-[17px] xl:ml-[20px] ml-[23px] 3xl:ml-[27px] lg:mt-[11px] xl:mt-[13px] mt-[15px] 3xl:mt-[18px] not-italic text-black_901 lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 text-left w-[9%]">
                {
                  <>
                    {`2022 © Minerva`}
                    <br />
                    {`All rights reserved.`}
                  </>
                }
              </Text>
              <Row className="items-center justify-center lg:mb-[4px] xl:mb-[5px] mb-[6px] 3xl:mb-[7px] lg:ml-[199px] xl:ml-[228px] ml-[256.5px] 2xl:ml-[256px] 3xl:ml-[307px] lg:mt-[5px] xl:mt-[6px] mt-[7px] 3xl:mt-[8px] w-[42%]">
                <Button
                  className="common-pointer font-medium lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius4 text-black_901 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[7%]"
                  onClick={handleNavigate11}
                >{`Home`}</Button>
                <Button className="font-medium 3xl:ml-[119px] lg:ml-[77px] xl:ml-[88px] ml-[99.5px] 2xl:ml-[99px] lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius4 text-black_901 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[15%]">{`Privacy Policy`}</Button>
                <Button className="font-medium ml-[100px] 3xl:ml-[120px] lg:ml-[77px] xl:ml-[88px] lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius4 text-black_901 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[19%]">{`Terms of Service`}</Button>
                <Button
                  className="common-pointer font-medium ml-[100px] 3xl:ml-[120px] lg:ml-[77px] xl:ml-[88px] lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius4 text-black_901 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[10%]"
                  onClick={handleNavigate10}
                >{`About Us`}</Button>
              </Row>
              <Row className="items-center justify-center lg:ml-[169px] xl:ml-[193px] ml-[218px] 3xl:ml-[261px] lg:my-[13px] xl:my-[15px] my-[17px] 3xl:my-[20px] w-[7%]">
                <Image
                  src="img_instagram1.png"
                  className="lg:h-[21px] xl:h-[25px] h-[27px] 2xl:h-[28px] 3xl:h-[33px] object-contain lg:w-[21px] xl:w-[24px] w-[27px] 3xl:w-[32px]"
                  alt="instagram1"
                />
                <Image
                  src="img_twitter1.png"
                  className="lg:h-[18px] xl:h-[20px] h-[22px] 2xl:h-[23px] 3xl:h-[27px] xl:mb-[1px] lg:mb-[1px] mb-[2px] lg:ml-[11px] xl:ml-[13px] ml-[15px] 3xl:ml-[18px] xl:mt-[2px] lg:mt-[2px] mt-[3px] object-contain w-[25%]"
                  alt="twitter1"
                />
                <Image
                  src="img_facebook1.png"
                  className="lg:h-[21px] xl:h-[24px] h-[26px] 2xl:h-[27px] 3xl:h-[32px] xl:ml-[10px] ml-[12.19px] 2xl:ml-[12px] 3xl:ml-[14px] lg:ml-[9px] mt-[1px] object-contain lg:w-[20px] xl:w-[23px] w-[26px] 3xl:w-[31px]"
                  alt="facebook1"
                />
              </Row>
            </Row>
          </Column>
        </footer>
      </Column>
    </div>
  );
};

export default ListingsPagePage;
