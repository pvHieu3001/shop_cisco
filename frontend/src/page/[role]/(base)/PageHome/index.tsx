import SectionHowItWork from '../components/SectionHowItWork/SectionHowItWork'
import BackgroundSection from '../components/BackgroundSection/BackgroundSection'
import SectionHero2 from '../components/SectionHero/SectionHero2'
import SectionSliderLargeProduct from '../components/SectionSliderLargeProduct'
import SectionSliderProductCard from '../components/SectionSliderProductCard'
import SectionGridMoreExplore from '../components/SectionGridMoreExplore/SectionGridMoreExplore'
import SectionPromo2 from '../components/SectionPromo2'
import SectionSliderCategories from '../components/SectionSliderCategories/SectionSliderCategories'
import SectionGridFeatureItems from '../SectionGridFeatureItems'
import SectionPromo3 from '../components/SectionPromo3'
import SectionClientSay from '../components/SectionClientSay/SectionClientSay'
import SectionMagazine5 from '../BlogPage/SectionMagazine5'
import Heading from '../components/Heading/Heading'
import ButtonSecondary from '../shared/Button/ButtonSecondary'

function PageHome() {
  return (
    <div className='nc-PageHome relative overflow-hidden'>
      {/* SECTION HERO */}
      <SectionHero2 />

      <div className='container relative space-y-24 my-24 lg:space-y-32 lg:my-32'>
        {/* SECTION */}
        <SectionGridFeatureItems />

        <div className='py-24 lg:py-32 border-t border-b border-slate-200 dark:border-slate-700'>
          <SectionHowItWork />
        </div>

        {/* SECTION */}
        <div className='relative py-24 lg:py-32'>
          <BackgroundSection />
          <SectionGridMoreExplore />
        </div>

        {/*  */}
        <SectionPromo2 />

        {/* SECTION 3 */}
        <SectionSliderLargeProduct cardStyle='style2' />

        {/*  */}
        <SectionSliderCategories />

        {/* SECTION */}
        <SectionPromo3 />

        <SectionSliderProductCard heading='Best Sellers' subHeading='Best selling of the month' />

        <div className='relative py-24 lg:py-32'>
          <BackgroundSection />
          <div>
            <Heading rightDescText='From the Ciseco blog'>The latest news</Heading>
            <SectionMagazine5 />
            <div className='flex mt-16 justify-center'>
              <ButtonSecondary>Show all blog articles</ButtonSecondary>
            </div>
          </div>
        </div>

        {/*  */}
        <SectionClientSay />
      </div>
    </div>
  )
}

export default PageHome
