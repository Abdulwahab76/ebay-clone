import { useAddress,useContract } from '@thirdweb-dev/react'
import { env } from 'process'
import React, { useState } from 'react'
import Header from '../components/Header'
import { useRouter } from 'next/router'
const addItem = () => {
  const address = useAddress()
  const router = useRouter()
  const [preview, setPreview] = useState<string>()
  const [image, setImage] = useState<File>()
    const {contract} = useContract(
      process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
      'nft-collection'
    )
    console.log('==',contract);
    const mintNft = async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault()
      if(!contract || !address) return;
      if(!image){
        alert('Please select an image')
        return
      }
      const target = e.target as typeof e.target & {
        name: {value:string},
        description: {value:string}
      }
      const metadata = {
        name:target.name.value,
        description:target.description.value,
        image: image
      }

      try{
        const tx = await contract.mintTo(address,metadata)
        const receipt = tx.receipt;
        const tokenId = tx.id
        const nft = await tx.data()
        console.log(receipt,nft,tokenId);
        router.push('/')
      }
      catch(e){
        console.log(e)
      }
    }
  return (
    <div>
        <Header />
        <main className='border max-w-6xl mx-auto p-5 pl-10'>
            <h1 className='text-4xl font-bold'>Add an Item to the Marketplace</h1>
            <h2 className='text-xl font-semibold pt-5'>Item Details</h2>
            <p>
                By adding an item to the Marketplace, you're essentially Minting an NFT of the item into your wallet which we can then list for sale!
            </p>
            <div className='pt-2  flex p-2 flex-col md:flex-row justify-center items-center'>
                <img className='border h-72 w-72 object-contain' src={preview || "https://links.papareact.com/ucj"} alt="" />
                <form onSubmit={mintNft} className='flex flex-col flex-1 p-2 space-y-2'>
                  <label className='font-light'>Name of Item</label>
                  <input name='name' id='name' className='formFieild' type="text" placeholder='Name of item... ' />
                  <label className='font-light'>Description</label>
                  <input name='description' id='description'  className='formFieild' type="text" placeholder='Enter Description...'/>
                  <label className='font-light'>Image of the item</label>
                  <input onChange={(e)=>{
                    if(e.target.files?.[0]){
                      setPreview(URL.createObjectURL(e.target.files[0]));
                      setImage(e.target.files[0]);
                    }
                  }}  className='cursor-pointer' type="file" />

                  <button type='submit' className='bg-blue-600  w-52 font-bold text-white rounded-full py-3 px-6  md:mt-auto mx-auto md:ml-auto '>Add/Mint Item</button>
                </form>
            </div>
        </main>
    </div>
  )
}

export default addItem