import React, { useState } from 'react'
import { Image } from 'react-bootstrap'

interface SodaImageProps {
	src: string
}

const SodaImage = (props: SodaImageProps) => {
	const [isLoaded, setIsLoaded] = useState<boolean>(false)
	const { src } = props;
	return (
		<>
			{!isLoaded && <>Loading...</>}
			<Image
				rounded
				src={src}
				fluid
				onLoad={() => setIsLoaded(true)}
			/>
		</>
	)
}

export default SodaImage