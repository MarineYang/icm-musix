import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function AboutICM() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 스크롤 진행도에 따라 INSPIRE… 블러 처리
  const blurValue = useTransform(scrollYProgress, [0, 0.1], ["0px", "8px"]);
  const inspireOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.1]);
  const inspireY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-30%"]);
  const icmY = useTransform(scrollYProgress, [0, 0.5], ["250%", "-100%"]);
  const descOpacity = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);
  const descY = useTransform(scrollYProgress, [0.3, 0.7], ["100vh", "10vh"]);
  const descFadeOut = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);
  
  // CONTACT US 섹션 애니메이션
  const contactOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const contactY = useTransform(scrollYProgress, [0.9, 1], ["100px", "0px"]);
  
  
  // ICM fade out
  const icmFadeOut = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-black text-white">
      {/* sticky container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center text-center relative">
        {/* INSPIRE COLOURS MUSIX - 배경 */}
        <motion.h1
          style={{ filter: blurValue, opacity: inspireOpacity, y: inspireY }}
          className="text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-black leading-none"
        >
          INSPIRE 
          COLOURS <br />
          MUSIX
        </motion.h1>

        {/* ICM - MUSIX 아래에서 시작해서 위로 이동 */}
        <motion.h2
          style={{ y: icmY, opacity: icmFadeOut }}
          className="absolute text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-extrabold z-10"
        >
          ICM
        </motion.h2>

        {/* 설명 텍스트 */}
        <motion.div
          style={{ opacity: useTransform([descOpacity, descFadeOut], ([desc, fade]) => (desc as number) * (fade as number)), y: descY }}
          className="absolute max-w-5xl text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-300 z-10 px-4"
        >
          <p className="mb-6">
            ICM은 "우리가 가진 색(Colours)으로 영감을(Inspire) 주고, 장르나 틀에 갇히지 않는(Musix) 음악을 만든다"는 철학에서 시작되었습니다.
          </p>
          
          <p className="mb-6">
            힙합을 기반으로 알앤비, 팝, 일렉트로닉 등 다양한 장르의 색을 자유롭게 넘나들며, 새로운 영감과 무한한 가능성을 보여주고자 합니다. 우리는 정해진 형식에 머무르지 않습니다.
          </p>
          
          <p className="mb-6">
            Musix는 "무한한 가능성과 섞임, 그리고 미래성"을 담은 우리의 언어이자 정체성입니다.
          </p>
          
          <p>
            ICM은 글로벌 무대에서 경쟁력을 갖추고, 음악 그 이상의 가치인 자유, 다양성, 그리고 연결을 전달하는 브랜드로 성장해 나갈 것입니다.
          </p>
          
        </motion.div>


        {/* CONTACT US 섹션 */}
        <motion.div
          style={{ opacity: contactOpacity, y: contactY }}
          className="absolute max-w-4xl text-center z-10 px-4"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-12">
            CONTACT US
          </h2>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-white">Email</h3>
              <p className="text-lg md:text-xl text-gray-300">
                <a href="mailto:official@icm-music.com" className="hover:text-white transition-colors">
                  official@icm-music.com
                </a>
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-white">Address</h3>
              <p className="text-lg md:text-xl text-gray-300">
                서울특별시 강남구 테헤란로 123<br />
                ICM 빌딩 5층
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-white">Business Inquiries</h3>
              <p className="text-lg md:text-xl text-gray-300">
                <a href="mailto:business@icm-music.com" className="hover:text-white transition-colors">
                  business@icm-music.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
