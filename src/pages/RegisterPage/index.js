import React, {useState} from "react";

import { useNavigate } from "react-router-dom";
import { Row } from "components/Row";
import { Column } from "components/Column";
import { Image } from "components/Image";
import { Text } from "components/Text";
import { Button } from "components/Button";
import { Stack } from "components/Stack";
import { Input } from "components/Input";
import { SelectBox } from "components/SelectBox";
import { supabaseClient } from '../../config/supabase-client';


const RegisterPagePage = () => {
  const navigate = useNavigate();
  const handleNavigate21 = () => navigate("/");
  const handleNavigate16 = () => navigate("/loginpage");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <>
      <Row className="bg-white_A700 font-nunitosans items-center mx-[auto] w-[100%]">
      
        <Column className="bg-bluegray_101 items-start mb-[0px] w-[57%]">
        
          <Image
            src="img_minervalogo1_2.png"
            className="common-pointer lg:h-[62px] xl:h-[71px] h-[79px] 2xl:h-[80px] 3xl:h-[95px] lg:mt-[20px] xl:mt-[23px] mt-[26px] 3xl:mt-[31px] lg:mx-[51px] xl:mx-[58px] mx-[66px] 3xl:mx-[79px] object-contain w-[20%]"
            onClick={handleNavigate21}
            alt="MINERVALOGO1"
          />
          <Text className="font-normal lg:ml-[51px] xl:ml-[58px] ml-[66px] 3xl:ml-[79px] lg:mr-[44px] xl:mr-[50px] mr-[57px] 3xl:mr-[68px] lg:mt-[32px] xl:mt-[37px] mt-[42px] 3xl:mt-[50px] not-italic lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-gray_901 text-left">{`Username`}</Text>
          <Input className="bg-gray_100 border border-bluegray_100 border-solid font-normal lg:ml-[51px] xl:ml-[58px] ml-[66px] 3xl:ml-[79px] lg:mr-[44px] xl:mr-[50px] mr-[57px] 3xl:mr-[68px] lg:mt-[4px] xl:mt-[5px] mt-[6px] 3xl:mt-[7px] not-italic lg:pl-[12px] xl:pl-[14px] pl-[16px] 3xl:pl-[19px] lg:py-[3px] py-[4.5px] 2xl:py-[4px] xl:py-[4px] 3xl:py-[5px] rounded-radius12 text-bluegray_500 lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-left" placeholder="Enter username"></Input>
          <Text className="font-normal lg:ml-[51px] xl:ml-[58px] ml-[66px] 3xl:ml-[79px] lg:mr-[44px] xl:mr-[50px] mr-[57px] 3xl:mr-[68px] mt-[11px] 3xl:mt-[13px] lg:mt-[8px] xl:mt-[9px] not-italic lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-gray_901 text-left">{`Email`}</Text>
          <Input value={email} onChange={e => setEmail(e.target.value)} type="email" className="bg-gray_100 border border-bluegray_100 border-solid font-normal lg:ml-[51px] xl:ml-[58px] ml-[66px] 3xl:ml-[79px] lg:mr-[44px] xl:mr-[50px] mr-[57px] 3xl:mr-[68px] lg:mt-[4px] xl:mt-[5px] mt-[6px] 3xl:mt-[7px] not-italic lg:pl-[12px] xl:pl-[14px] pl-[16px] 3xl:pl-[19px] lg:py-[3px] py-[4.5px] 2xl:py-[4px] xl:py-[4px] 3xl:py-[5px] rounded-radius12 text-bluegray_500 lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-left" placeholder="Enter email"></Input>
          <Text className="font-normal lg:ml-[51px] xl:ml-[58px] ml-[66px] 3xl:ml-[79px] lg:mr-[44px] xl:mr-[50px] mr-[57px] 3xl:mr-[68px] lg:mt-[12px] xl:mt-[14px] mt-[16px] 3xl:mt-[19px] not-italic lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-gray_901 text-left">{`Password`}</Text>
          <Input value={password} onChange={e => setPassword(e.target.value)} type="password" className="bg-gray_100 border border-bluegray_100 border-solid font-normal lg:ml-[51px] xl:ml-[58px] ml-[66px] 3xl:ml-[79px] lg:mr-[44px] xl:mr-[50px] mr-[57px] 3xl:mr-[68px] lg:mt-[4px] xl:mt-[5px] mt-[6px] 3xl:mt-[7px] not-italic lg:pl-[12px] xl:pl-[14px] pl-[16px] 3xl:pl-[19px] lg:py-[3px] py-[4.5px] 2xl:py-[4px] xl:py-[4px] 3xl:py-[5px] rounded-radius12 text-bluegray_500 lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-left" placeholder="Enter password"></Input>
          <Text className="font-normal lg:ml-[51px] xl:ml-[58px] ml-[66px] 3xl:ml-[79px] lg:mr-[44px] xl:mr-[50px] mr-[57px] 3xl:mr-[68px] lg:mt-[12px] xl:mt-[14px] mt-[16px] 3xl:mt-[19px] not-italic lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-gray_901 text-left">{`Confirm password`}</Text>
          <Input type="password" className="bg-gray_100 border border-bluegray_100 border-solid font-normal lg:ml-[51px] xl:ml-[58px] ml-[66px] 3xl:ml-[79px] lg:mr-[44px] xl:mr-[50px] mr-[57px] 3xl:mr-[68px] lg:mt-[4px] xl:mt-[5px] mt-[6px] 3xl:mt-[7px] not-italic lg:pl-[12px] xl:pl-[14px] pl-[16px] 3xl:pl-[19px] lg:py-[3px] py-[4.5px] 2xl:py-[4px] xl:py-[4px] 3xl:py-[5px] rounded-radius12 text-bluegray_500 lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-left" placeholder="Confirm password"></Input>
          <Text className="font-normal 3xl:mt-[10px] lg:mt-[7px] xl:mt-[8px] mt-[9px] lg:mx-[51px] xl:mx-[58px] mx-[66px] 3xl:mx-[79px] not-italic text-black_900 lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-left">{`Country`}</Text>
          <Column className="items-center lg:mb-[19px] xl:mb-[22px] mb-[25px] 3xl:mb-[30px] lg:mt-[10px] xl:mt-[11px] mt-[13px] 3xl:mt-[15px] w-[100%]">
            <SelectBox
              className="lg:h-[35px] xl:h-[41px] h-[45px] 2xl:h-[46px] 3xl:h-[55px] mx-[auto] object-contain rounded-radius12 w-[85%]"
              ></SelectBox>
            <Button onClick={e => {
                    e.preventDefault();
                    handleLogin(email, password, navigate );
            }} 
                  className="bg-blue_A700 border border-blue_A700 border-solid font-bold lg:mt-[31px] xl:mt-[36px] mt-[41px] 3xl:mt-[49px] mx-[auto] lg:py-[24px] xl:py-[27px] py-[31px] 3xl:py-[37px] rounded-radius12 text-center lg:text-fs24 xl:text-fs28 text-fs32 3xl:text-fs38 text-white_A700 tracking-ls1 w-[89%]">{`Sign up`}</Button>
            <Row className="items-end justify-center mt-[1px] mx-[auto] w-[45%]">
              <Text className="font-normal xl:mb-[2px] lg:mb-[2px] mb-[3px] xl:mt-[10px] mt-[12px] 3xl:mt-[14px] lg:mt-[9px] not-italic text-black_900 text-center lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33">{`Have an account?`}</Text>
              <Text
                className="common-pointer font-bold ml-[10px] 3xl:ml-[12px] lg:ml-[7px] xl:ml-[8px] xl:pb-[2px] lg:pb-[2px] pb-[3px] xl:pt-[10px] pt-[12px] 3xl:pt-[14px] lg:pt-[9px] px-[0] rounded-radius4 text-center lg:text-fs21 xl:text-fs24 text-fs28 3xl:text-fs33 text-gray_900"
                onClick={handleNavigate16}
              >{`Log in now`}</Text>
            </Row>
            
          </Column>
          
        </Column>
        
        <Stack className="font-merriweather 3xl:h-[1025px] lg:h-[500px] xl:h-[1000px] h-[100%] 2xl:h-[1000px] w-[43%]">
        <Image
            src="img_image5.png"
            className="3xl:h-[1025px] lg:h-[500px] xl:h-[1000px] h-[1000px] 2xl:h-[1000px] inset-[0] object-cover w-[100%]"
            alt="image5"
          />
          <Column className="absolute inset-x-[0] items-start justify-start mx-[auto] top-[5%] w-[86%]">
          
            
            <Column className="w-[100%]">
              <Row className="items-start justify-end w-[100%]">
                <Image
                  src="img_image3.png"
                  className="lg:h-[123px] xl:h-[140px] h-[157px] 2xl:h-[158px] 3xl:h-[189px] lg:mt-[130px] xl:mt-[149px] mt-[168px] 3xl:mt-[201px] object-contain rounded-radius86 w-[46%]"
                  alt="image3"
                />
                <Image
                  src="img_image2.png"
                  className="lg:h-[131px] xl:h-[150px] h-[168px] 2xl:h-[169px] 3xl:h-[202px] lg:mb-[122px] xl:mb-[139px] mb-[157px] 3xl:mb-[188px] xl:ml-[3px] lg:ml-[3px] ml-[4px] object-contain rounded-radius89 w-[48%]"
                  alt="image2"
                />
              </Row>
            </Column>
            <Column className="items-end w-[100%]">
              <Image
                src="img_image4.png"
                className="lg:h-[128px] xl:h-[146px] h-[164px] 2xl:h-[165px] 3xl:h-[197px] lg:ml-[212px] xl:ml-[242px] ml-[273px] 3xl:ml-[327px] xl:mr-[1px] lg:mr-[1px] mr-[2px] object-contain rounded-radius92 w-[48%]"
                alt="image4"
              />
            </Column>
            <Text className="capitalize font-bold italic lg:leading-lh34 xl:leading-lh39 2xl:leading-lh44 leading-lh4400 3xl:leading-lh52 mr-[10px] 3xl:mr-[12px] lg:mr-[7px] xl:mr-[8px] text-black_900 lg:text-fs46 xl:text-fs53 text-fs60 3xl:text-fs72 text-left lg:tracking-ls1 tracking-ls12 3xl:tracking-ls2 2xl:tracking-ls2 xl:tracking-ls2 w-[82%]">
              {
                <>
                  {`Anytime`}
                  <br />
                  <br />
                  {`Anywhere`}
                  <br />
                  <br />
                  {`with Minerva`}
                </>
              }
            </Text>
          </Column>
        </Stack>
      </Row>
    </>
  );
};

const handleLogin = async (email, password, navigate) => {
  try {
    const { error } = await supabaseClient.auth.signIn(email, password);
    if (error) throw error;
    alert('logged in');
    navigate.push('/listingspage');
  } catch (error) {
    alert(error.message);
  }
};

export default RegisterPagePage;
