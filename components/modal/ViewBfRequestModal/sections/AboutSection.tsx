import Image from 'next/image'

const AboutSection = ({ bio }: { bio: string | undefined }) => {
  return (
    <div className='flex min-h-[200px] flex-wrap justify-start'>
      <div className='pb-10 pl-5'>
        <h1 className='text-[14px] font-bold mb-5 text-left'>{bio}</h1>
        <h2 className='font-semibold text-left'>Member since</h2>
        <p className='mb-5 text-left'>2025</p>
        <h2 className='font-semibold text-left'>Socials</h2>
        <div className='flex space-x-4'>
          {[
            { src: '/icon/linkedin.svg', alt: 'LinkedIn' },
            { src: '/icon/x.svg', alt: 'Message' },
            { src: '/icon/instagram.svg', alt: 'Instagram' },
            { src: '/icon/facebook.svg', alt: 'Facebook' },
            { src: '/icon/youtube.svg', alt: 'YouTube' },
            { src: '/icon/globe.svg', alt: 'Website' }
          ].map((icon, index) => (
            <Image
              key={index}
              src={icon.src}
              alt={icon.alt}
              width={24}
              height={24}
              className=' w-[25px] h-auto'
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutSection
