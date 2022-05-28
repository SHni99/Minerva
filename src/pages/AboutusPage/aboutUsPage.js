import React from "react";
import aboutUsStyles from "./aboutUsPage.module.css";

import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import { useNavigate } from "react-router-dom";
import { Column } from "components/Column";
import { Row } from "components/Row";
import { Image } from "components/Image";
import { Button } from "components/Button";
import { Stack } from "components/Stack";
import { Line } from "components/Line";
import { Text } from "components/Text";

const AboutusPagePage = () => {
  const navigate = useNavigate();

  const handleNavigate6 = () => navigate("/");

  return (
    <div>
      <NavBar />
      <Column className="bg-white_A700 font-nunitosans mx-[auto] w-[100%]">
        <Column className="items-center justify-start lg:mt-[39px] xl:mt-[45px] mt-[51px] 3xl:mt-[61px] w-[100%]">
          <Stack className="font-inter lg:h-[1159px] xl:h-[1325px] h-[1489px] 2xl:h-[1491px] 3xl:h-[1788px] w-[100%]">
            <Column className="absolute inset-[0] items-center justify-start w-[100%]">
              <Text className="font-poppins font-semibold lg:mt-[60px] xl:mt-[69px] mt-[78px] 3xl:mt-[93px] mx-[auto] text-black_900 lg:text-fs49 xl:text-fs56 text-fs64 3xl:text-fs76 text-left lg:tracking-ls1 tracking-ls128 3xl:tracking-ls2 2xl:tracking-ls2 xl:tracking-ls2">{`About us`}</Text>
              <Column className="font-poppins lg:mt-[254px] xl:mt-[290px] mt-[327px] 3xl:mt-[392px] w-[100%]">
                <Row className="items-center justify-center w-[100%]">
                  <Line className="bg-black_900_00 h-[1px] w-[18%]" />
                  <Line className="bg-black_900_00 h-[1px] lg:ml-[171px] xl:ml-[195px] ml-[220px] 3xl:ml-[264px] w-[16%]" />
                </Row>
                <Row className="items-center justify-center lg:mb-[4px] xl:mb-[5px] mb-[6px] 3xl:mb-[7px] lg:mt-[31px] xl:mt-[36px] mt-[41px] 3xl:mt-[49px] w-[100%]">
                  <Text className="font-semibold lg:leading-lh3 2xl:leading-lh4 xl:leading-lh4 leading-lh450 3xl:leading-lh5 text-black_900 text-center lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 tracking-ls1 w-[18%]">
                    <span className="text-black_900 font-poppins">
                      <>
                        {`Ni Shenghan`}
                        <br />
                        {``}
                      </>
                    </span>
                    <span className="text-black_900 font-poppins font-normal">
                      <>
                        {`Telegram: @boba_fatt`}
                        <br />
                        {`GitHub: SHni99`}
                      </>
                    </span>
                  </Text>
                  <Text className="font-semibold lg:leading-lh3 2xl:leading-lh4 xl:leading-lh4 leading-lh450 3xl:leading-lh5 lg:ml-[182px] xl:ml-[208px] ml-[234px] 3xl:ml-[280px] text-black_900 text-center lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 tracking-ls1 w-[15%]">
                    <span className="text-black_900 font-poppins">
                      <>
                        {`Kok Chun Zhi`}
                        <br />
                        {``}
                      </>
                    </span>
                    <span className="text-black_900 font-poppins font-normal">
                      <>
                        {`Telegram: @kokcz`}
                        <br />
                        {`GitHub: chunzkok`}
                      </>
                    </span>
                  </Text>
                </Row>
              </Column>
              <Line className="bg-black_900 h-[1px] lg:mt-[57px] xl:mt-[65px] mt-[74px] 3xl:mt-[88px] mx-[auto] w-[69%]" />
              <Text className="font-inter font-normal lg:leading-lh24 xl:leading-lh27 2xl:leading-lh31 leading-lh3100 3xl:leading-lh37 lg:mt-[44px] xl:mt-[50px] mt-[57px] 3xl:mt-[68px] mx-[auto] not-italic text-black_900 text-center lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 tracking-ls1 w-[78%]">
                {
                  <>
                    {`Hello! We are two students studying Computer Science in NUS.`}
                    <br />
                    {`This project was created as part of Orbital 2022, and it is meant to tackle the lack of proper tuition-matching services in Singapore.`}
                    <br />
                    {`We hope that this project can benefit both tutors and tutees by making the matching process easier and simpler!`}
                  </>
                }
              </Text>
              <Line className="bg-black_900 h-[1px] lg:mt-[63px] xl:mt-[72px] mt-[81px] 3xl:mt-[97px] mx-[auto] w-[69%]" />
              <Text className="font-poppins font-semibold lg:leading-lh24 xl:leading-lh27 2xl:leading-lh31 leading-lh3100 3xl:leading-lh37 lg:mb-[15px] xl:mb-[17px] mb-[20px] 3xl:mb-[24px] lg:mt-[36px] xl:mt-[41px] mt-[47px] 3xl:mt-[56px] mx-[auto] text-black_900 text-center lg:text-fs62 xl:text-fs71 text-fs80 3xl:text-fs96 tracking-ls2 w-[76%]">
                <span className="text-black_900 text-fs64 lg:text-fs49 xl:text-fs56 3xl:text-fs76">
                  <>
                    {`Our mission`}
                    <br />
                    {``}
                  </>
                </span>
                <span className="text-black_900 text-fs24 font-inter font-normal lg:text-fs18 xl:text-fs21 3xl:text-fs28">
                  <>
                    {`The team name, Minerva, was chosen as the Roman goddess epitomises wisdom, presenting an image befitting of our vision for the project.`}
                    <br />
                    {`The main goal of this project is to create a convenient platform for tutors and tutees to connect, facilitating the proliferation of knowledge.`}
                  </>
                </span>
              </Text>
            </Column>
          </Stack>
        </Column>
      </Column>
      <FooterBar />
    </div>
  );
};

export default AboutusPagePage;
