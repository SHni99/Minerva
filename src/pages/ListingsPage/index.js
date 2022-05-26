import React from "react";

import { useNavigate } from "react-router-dom";
import NavBar from "components/NavBar/navBar";
import { Column } from "components/Column";
import { Row } from "components/Row";
import { Image } from "components/Image";
import { Button } from "components/Button";
import { Text } from "components/Text";
import { Stack } from "components/Stack";
import FooterBar from "components/FooterBar/footerBar";

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
      </Column>
      <FooterBar />
    </div>
  );
};

export default ListingsPagePage;
