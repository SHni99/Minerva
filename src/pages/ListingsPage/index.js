import React from "react";

import { useNavigate } from "react-router-dom";
import { Column } from "components/Column";
import { Row } from "components/Row";
import { Image } from "components/Image";
import { Button } from "components/Button";
import { Text } from "components/Text";
import { Stack } from "components/Stack";
import { Grid } from "components/Grid";
import { List } from "components/List";
import { Line } from "components/Line";

const ListingsPagePage = () => {
  const navigate = useNavigate();

  const handleNavigate22 = () => navigate("/");
  const handleNavigate15 = () => navigate("/");
  const handleNavigate14 = () => navigate("/aboutuspage");
  const handleNavigate13 = () => navigate("/loginpage");
  const handleNavigate12 = () => navigate("/registerpage");
  const handleNavigate11 = () => navigate("/");
  const handleNavigate10 = () => navigate("/aboutuspage");

  return (
    <>
      <Column className="bg-white_A700 font-nunitosans items-center justify-end mx-[auto] w-[100%]">
        <header className="lg:mt-[39px] xl:mt-[45px] mt-[51px] 3xl:mt-[61px] mx-[auto] w-[86%]">
          <Row className="items-center justify-start w-[100%]">
            <Image
              src="img_minervalogo1_3.png"
              className="common-pointer 3xl:h-[112px] lg:h-[73px] xl:h-[83px] h-[93px] 2xl:h-[94px] object-contain w-[24%]"
              onClick={handleNavigate22}
              alt="MINERVALOGO1"
            />
            <Row className="font-inter items-center justify-center xl:mb-[20px] mb-[23px] 3xl:mb-[27px] lg:ml-[29px] xl:ml-[33px] ml-[38px] 3xl:ml-[45px] xl:mt-[19px] mt-[22px] 3xl:mt-[26px] lg:my-[17px] w-[22%]">
              <Button
                className="common-pointer font-medium lg:py-[10px] xl:py-[12px] py-[14px] 3xl:py-[16px] rounded-radius4 text-black_901 text-center lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 w-[20%]"
                onClick={handleNavigate15}
              >{`Home`}</Button>
              <Button className="font-medium lg:ml-[27px] xl:ml-[31px] ml-[35px] 3xl:ml-[42px] lg:py-[10px] xl:py-[12px] py-[14px] 3xl:py-[16px] rounded-radius4 text-center lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 text-indigo_700 w-[27%]">{`Listings`}</Button>
              <Button
                className="common-pointer font-medium lg:ml-[18px] xl:ml-[21px] ml-[24px] 3xl:ml-[28px] lg:py-[10px] xl:py-[12px] py-[14px] 3xl:py-[16px] rounded-radius4 text-black_901 text-center lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 w-[32%]"
                onClick={handleNavigate14}
              >{`About Us`}</Button>
            </Row>
            <Button
              className="common-pointer font-normal lg:mb-[13px] xl:mb-[15px] mb-[17px] 3xl:mb-[20px] lg:ml-[312px] xl:ml-[357px] ml-[402px] 3xl:ml-[482px] lg:mt-[12px] xl:mt-[14px] mt-[16px] 3xl:mt-[19px] not-italic lg:py-[15px] xl:py-[17px] py-[20px] 3xl:py-[24px] rounded-radius4 text-center lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 text-light_blue_900 w-[8%]"
              onClick={handleNavigate13}
            >{`Log in`}</Button>
            <Button
              className="common-pointer bg-light_blue_900 border border-light_blue_900 border-solid font-normal xl:mb-[20px] mb-[23px] 3xl:mb-[27px] 3xl:ml-[10px] lg:ml-[7px] xl:ml-[8px] ml-[9px] xl:mt-[19px] mt-[22px] 3xl:mt-[26px] lg:my-[17px] not-italic lg:py-[10px] xl:py-[12px] py-[14px] 3xl:py-[16px] rounded-radius11 text-center lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 text-white_A700 w-[9%]"
              onClick={handleNavigate12}
            >{`Sign up`}</Button>
          </Row>
        </header>
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
            <Stack className="absolute 3xl:h-[1115px] lg:h-[722px] xl:h-[826px] h-[928px] 2xl:h-[929px] inset-[0] w-[100%]">
              <Column className="absolute inset-[0] items-center justify-end rounded-radius12 w-[100%]">
                <Grid className="lg:gap-[24px] xl:gap-[27px] gap-[31px] 3xl:gap-[37px] grid grid-cols-4 lg:mt-[31px] xl:mt-[36px] mt-[41px] 3xl:mt-[49px] w-[100%]">
                  <Stack className="lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] w-[100%]">
                    <Stack className="absolute bg-white_A700 border border-gray_500 border-solid lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] inset-[0] rounded-radius16 shadow-bs w-[100%]">
                      <Image
                        src="img_avatarmaster.png"
                        className="absolute 3xl:h-[109px] lg:h-[70px] xl:h-[81px] h-[90px] 2xl:h-[91px] inset-x-[0] mx-[auto] object-contain rounded-radius200 top-[9%] w-[40%]"
                        alt="Avatarmaster"
                      />
                    </Stack>
                    <Column className="absolute bottom-[0] inset-x-[0] items-center justify-center w-[100%]">
                      <Text className="font-nunito font-semibold xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] mx-[auto] text-black_900 lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-left">{`Listing title`}</Text>
                      <Text className="font-inter font-normal lg:leading-lh17 xl:leading-lh20 2xl:leading-lh23 leading-lh2300 3xl:leading-lh27 lg:mb-[21px] xl:mb-[24px] mb-[28px] 3xl:mb-[33px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] mx-[auto] not-italic text-black_900 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[76%]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Text>
                    </Column>
                  </Stack>
                  <Stack className="lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] w-[100%]">
                    <Stack className="absolute bg-white_A700 border border-gray_500 border-solid lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] inset-[0] rounded-radius16 shadow-bs w-[100%]">
                      <Image
                        src="img_avatarmaster.png"
                        className="absolute 3xl:h-[109px] lg:h-[70px] xl:h-[81px] h-[90px] 2xl:h-[91px] inset-x-[0] mx-[auto] object-contain rounded-radius200 top-[9%] w-[40%]"
                        alt="Avatarmaster"
                      />
                    </Stack>
                    <Column className="absolute bottom-[0] inset-x-[0] items-center justify-center w-[100%]">
                      <Text className="font-nunito font-semibold xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] mx-[auto] text-black_900 lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-left">{`Listing title`}</Text>
                      <Text className="font-inter font-normal lg:leading-lh17 xl:leading-lh20 2xl:leading-lh23 leading-lh2300 3xl:leading-lh27 lg:mb-[21px] xl:mb-[24px] mb-[28px] 3xl:mb-[33px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] mx-[auto] not-italic text-black_900 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[76%]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Text>
                    </Column>
                  </Stack>
                  <Stack className="lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] w-[100%]">
                    <Stack className="absolute bg-white_A700 border border-gray_500 border-solid lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] inset-[0] rounded-radius16 shadow-bs w-[100%]">
                      <Image
                        src="img_avatarmaster.png"
                        className="absolute 3xl:h-[109px] lg:h-[70px] xl:h-[81px] h-[90px] 2xl:h-[91px] inset-x-[0] mx-[auto] object-contain rounded-radius200 top-[9%] w-[40%]"
                        alt="Avatarmaster"
                      />
                    </Stack>
                    <Column className="absolute bottom-[0] inset-x-[0] items-center justify-center w-[100%]">
                      <Text className="font-nunito font-semibold xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] mx-[auto] text-black_900 lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-left">{`Listing title`}</Text>
                      <Text className="font-inter font-normal lg:leading-lh17 xl:leading-lh20 2xl:leading-lh23 leading-lh2300 3xl:leading-lh27 lg:mb-[21px] xl:mb-[24px] mb-[28px] 3xl:mb-[33px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] mx-[auto] not-italic text-black_900 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[76%]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Text>
                    </Column>
                  </Stack>
                  <Stack className="lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] w-[100%]">
                    <Stack className="absolute bg-white_A700 border border-gray_500 border-solid lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] inset-[0] rounded-radius16 shadow-bs w-[100%]">
                      <Image
                        src="img_avatarmaster.png"
                        className="absolute 3xl:h-[109px] lg:h-[70px] xl:h-[81px] h-[90px] 2xl:h-[91px] inset-x-[0] mx-[auto] object-contain rounded-radius200 top-[9%] w-[40%]"
                        alt="Avatarmaster"
                      />
                    </Stack>
                    <Column className="absolute bottom-[0] inset-x-[0] items-center justify-center w-[100%]">
                      <Text className="font-nunito font-semibold xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] mx-[auto] text-black_900 lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-left">{`Listing title`}</Text>
                      <Text className="font-inter font-normal lg:leading-lh17 xl:leading-lh20 2xl:leading-lh23 leading-lh2300 3xl:leading-lh27 lg:mb-[21px] xl:mb-[24px] mb-[28px] 3xl:mb-[33px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] mx-[auto] not-italic text-black_900 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[76%]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Text>
                    </Column>
                  </Stack>
                  <Stack className="lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] w-[100%]">
                    <Stack className="absolute bg-white_A700 border border-gray_500 border-solid lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] inset-[0] rounded-radius16 shadow-bs w-[100%]">
                      <Image
                        src="img_avatarmaster.png"
                        className="absolute 3xl:h-[109px] lg:h-[70px] xl:h-[81px] h-[90px] 2xl:h-[91px] inset-x-[0] mx-[auto] object-contain rounded-radius200 top-[9%] w-[40%]"
                        alt="Avatarmaster"
                      />
                    </Stack>
                    <Column className="absolute bottom-[0] inset-x-[0] items-center justify-center w-[100%]">
                      <Text className="font-nunito font-semibold xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] mx-[auto] text-black_900 lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-left">{`Listing title`}</Text>
                      <Text className="font-inter font-normal lg:leading-lh17 xl:leading-lh20 2xl:leading-lh23 leading-lh2300 3xl:leading-lh27 lg:mb-[21px] xl:mb-[24px] mb-[28px] 3xl:mb-[33px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] mx-[auto] not-italic text-black_900 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[76%]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Text>
                    </Column>
                  </Stack>
                  <Stack className="lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] w-[100%]">
                    <Stack className="absolute bg-white_A700 border border-gray_500 border-solid lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] inset-[0] rounded-radius16 shadow-bs w-[100%]">
                      <Image
                        src="img_avatarmaster.png"
                        className="absolute 3xl:h-[109px] lg:h-[70px] xl:h-[81px] h-[90px] 2xl:h-[91px] inset-x-[0] mx-[auto] object-contain rounded-radius200 top-[9%] w-[40%]"
                        alt="Avatarmaster"
                      />
                    </Stack>
                    <Column className="absolute bottom-[0] inset-x-[0] items-center justify-center w-[100%]">
                      <Text className="font-nunito font-semibold xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] mx-[auto] text-black_900 lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-left">{`Listing title`}</Text>
                      <Text className="font-inter font-normal lg:leading-lh17 xl:leading-lh20 2xl:leading-lh23 leading-lh2300 3xl:leading-lh27 lg:mb-[21px] xl:mb-[24px] mb-[28px] 3xl:mb-[33px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] mx-[auto] not-italic text-black_900 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[76%]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Text>
                    </Column>
                  </Stack>
                  <Stack className="lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] w-[100%]">
                    <Stack className="absolute bg-white_A700 border border-gray_500 border-solid lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] inset-[0] rounded-radius16 shadow-bs w-[100%]">
                      <Image
                        src="img_avatarmaster.png"
                        className="absolute 3xl:h-[109px] lg:h-[70px] xl:h-[81px] h-[90px] 2xl:h-[91px] inset-x-[0] mx-[auto] object-contain rounded-radius200 top-[9%] w-[40%]"
                        alt="Avatarmaster"
                      />
                    </Stack>
                    <Column className="absolute bottom-[0] inset-x-[0] items-center justify-center w-[100%]">
                      <Text className="font-nunito font-semibold xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] mx-[auto] text-black_900 lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-left">{`Listing title`}</Text>
                      <Text className="font-inter font-normal lg:leading-lh17 xl:leading-lh20 2xl:leading-lh23 leading-lh2300 3xl:leading-lh27 lg:mb-[21px] xl:mb-[24px] mb-[28px] 3xl:mb-[33px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] mx-[auto] not-italic text-black_900 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[76%]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Text>
                    </Column>
                  </Stack>
                  <Stack className="lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] w-[100%]">
                    <Stack className="absolute bg-white_A700 border border-gray_500 border-solid lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] inset-[0] rounded-radius16 shadow-bs w-[100%]">
                      <Image
                        src="img_avatarmaster.png"
                        className="absolute 3xl:h-[109px] lg:h-[70px] xl:h-[81px] h-[90px] 2xl:h-[91px] inset-x-[0] mx-[auto] object-contain rounded-radius200 top-[9%] w-[40%]"
                        alt="Avatarmaster"
                      />
                    </Stack>
                    <Column className="absolute bottom-[0] inset-x-[0] items-center justify-center w-[100%]">
                      <Text className="font-nunito font-semibold xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] mx-[auto] text-black_900 lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-left">{`Listing title`}</Text>
                      <Text className="font-inter font-normal lg:leading-lh17 xl:leading-lh20 2xl:leading-lh23 leading-lh2300 3xl:leading-lh27 lg:mb-[21px] xl:mb-[24px] mb-[28px] 3xl:mb-[33px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] mx-[auto] not-italic text-black_900 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[76%]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Text>
                    </Column>
                  </Stack>
                </Grid>
                <Row className="items-center justify-between 3xl:mb-[10px] lg:mb-[7px] xl:mb-[8px] mb-[9px] lg:mt-[21px] xl:mt-[24px] mt-[28px] 3xl:mt-[33px] w-[100%]">
                  <Stack className="lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] lg:ml-[202px] xl:ml-[231px] ml-[260px] 3xl:ml-[312px] w-[23%]">
                    <Stack className="absolute bg-white_A700 border border-gray_500 border-solid lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] inset-[0] rounded-radius16 shadow-bs w-[100%]">
                      <Image
                        src="img_avatarmaster.png"
                        className="absolute 3xl:h-[109px] lg:h-[70px] xl:h-[81px] h-[90px] 2xl:h-[91px] inset-x-[0] mx-[auto] object-contain rounded-radius200 top-[9%] w-[40%]"
                        alt="Avatarmaster"
                      />
                    </Stack>
                    <Column className="absolute bottom-[0] inset-x-[0] items-center justify-center w-[100%]">
                      <Text className="font-nunito font-semibold xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] mx-[auto] text-black_900 lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-left">{`Listing title`}</Text>
                      <Text className="font-inter font-normal lg:leading-lh17 xl:leading-lh20 2xl:leading-lh23 leading-lh2300 3xl:leading-lh27 lg:mb-[21px] xl:mb-[24px] mb-[28px] 3xl:mb-[33px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] mx-[auto] not-italic text-black_900 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[76%]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Text>
                    </Column>
                  </Stack>
                  <Stack className="bg-white_A700 border border-gray_500 border-solid lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] rounded-radius16 shadow-bs w-[23%]">
                    <Image
                      src="img_avatarmaster.png"
                      className="absolute 3xl:h-[109px] lg:h-[70px] xl:h-[81px] h-[90px] 2xl:h-[91px] inset-x-[0] mx-[auto] object-contain rounded-radius200 top-[9%] w-[40%]"
                      alt="Avatarmaster"
                    />
                  </Stack>
                </Row>
              </Column>
              <Column className="absolute bottom-[1%] items-center justify-center right-[0] w-[23%]">
                <Text className="font-nunito font-semibold xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] mx-[auto] text-black_900 lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-left">{`Listing title`}</Text>
                <Text className="font-inter font-normal lg:leading-lh17 xl:leading-lh20 2xl:leading-lh23 leading-lh2300 3xl:leading-lh27 lg:mb-[21px] xl:mb-[24px] mb-[28px] 3xl:mb-[33px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] mx-[auto] not-italic text-black_900 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[76%]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Text>
              </Column>
            </Stack>
            <List
              className="absolute bottom-[0] lg:gap-[224px] xl:gap-[256px] gap-[288px] 3xl:gap-[345px] grid grid-cols-2 left-[0] min-h-[auto] w-[74%]"
              orientation="horizontal"
            >
              <Stack className="lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] w-[100%]">
                <Stack className="absolute bg-white_A700 border border-gray_500 border-solid lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] inset-[0] rounded-radius16 shadow-bs w-[100%]">
                  <Image
                    src="img_avatarmaster.png"
                    className="absolute 3xl:h-[109px] lg:h-[70px] xl:h-[81px] h-[90px] 2xl:h-[91px] inset-x-[0] mx-[auto] object-contain rounded-radius200 top-[9%] w-[40%]"
                    alt="Avatarmaster"
                  />
                </Stack>
                <Column className="absolute bottom-[0] inset-x-[0] items-center justify-center w-[100%]">
                  <Text className="font-nunito font-semibold xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] mx-[auto] text-black_900 lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-left">{`Listing title`}</Text>
                  <Text className="font-inter font-normal lg:leading-lh17 xl:leading-lh20 2xl:leading-lh23 leading-lh2300 3xl:leading-lh27 lg:mb-[21px] xl:mb-[24px] mb-[28px] 3xl:mb-[33px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] mx-[auto] not-italic text-black_900 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[76%]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Text>
                </Column>
              </Stack>
              <Stack className="lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] w-[100%]">
                <Stack className="absolute bg-white_A700 border border-gray_500 border-solid lg:h-[214px] xl:h-[244px] h-[274px] 2xl:h-[275px] 3xl:h-[329px] inset-[0] rounded-radius16 shadow-bs w-[100%]">
                  <Image
                    src="img_avatarmaster.png"
                    className="absolute 3xl:h-[109px] lg:h-[70px] xl:h-[81px] h-[90px] 2xl:h-[91px] inset-x-[0] mx-[auto] object-contain rounded-radius200 top-[9%] w-[40%]"
                    alt="Avatarmaster"
                  />
                </Stack>
                <Column className="absolute bottom-[0] inset-x-[0] items-center justify-center w-[100%]">
                  <Text className="font-nunito font-semibold xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] mx-[auto] text-black_900 lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-left">{`Listing title`}</Text>
                  <Text className="font-inter font-normal lg:leading-lh17 xl:leading-lh20 2xl:leading-lh23 leading-lh2300 3xl:leading-lh27 lg:mb-[21px] xl:mb-[24px] mb-[28px] 3xl:mb-[33px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] mx-[auto] not-italic text-black_900 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[76%]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Text>
                </Column>
              </Stack>
            </List>
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
    </>
  );
};

export default ListingsPagePage;
