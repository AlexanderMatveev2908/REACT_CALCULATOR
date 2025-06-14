import Content from "./components/Content/Content";
import { useApp } from "./hooks/useApp";
import { useTest } from "./hooks/useTest";

const App = () => {
  const { resMath, textUser, fsz, ...rest } = useApp();

  // _
  return (
    <div className="w-full flex justify-center h-screen items-center">
      {/* CALCULATOR */}
      <div className="sm:min-w-[500px] sm:max-w-[500px] sm:h-[831px] sm:border border-[#222] rounded-[60px] w-full max-w-fit">
        {/* HEADER */}
        <div className="grid grid-cols-1">
          <div className="w-full flex justify-start items-center h-[122px] p-[40px] text-white text-[65px] leading-[54px] border-b border-[#222] font-[400]">
            Calculator
            {/* ({totDev}) */}
          </div>
        </div>
        {/* CONTENT LAYER*/}
        <div className="w-full h-[630px] pt-[30px] pb-[40px] sm:px-[40px] items-center">
          {/* CONTENT */}
          <div className="w-full h-[630px]">
            {/* TEXT BOARD */}
            <div className="max-w-full pb-[30px] flex justify-end">
              <span
                className={`${fsz} font-[400] text-white block overflow-x-scroll hide_scrollbar`}
              >
                {resMath ?? textUser}
              </span>
            </div>

            {/* BUTTONS */}
            <Content {...{ ...rest, ...useTest() }} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
