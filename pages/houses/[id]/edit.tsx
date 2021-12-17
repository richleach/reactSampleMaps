import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { loadIdToken } from "src/auth/firebaseAdmin";
import Layout from "src/components/layout";
import HouseForm from "src/components/houseForm";
import { useAuth } from "src/auth/useAuth";
import {
  EditHouseQuery,
  EditHouseQueryVariables,
} from "src/generated/EditHouseQuery";

const EDIT_HOUSE_QUERY = gql `
  query EditHouseQuery($id: String!) {
    house(id: $id){
      id
      userId
      address
      image
      publicId
      bedrooms
      latitude
      longitude
    }
  }
`

export default function EditHouse() {
  //snatch the url variable "id" SNIPPET
  const {query: {id}} = useRouter()

  if (!id) return null 
  return <HouseData id={id as string} />
}

function HouseData({id}: {id: string}) {

  //get the current user from useAuth SNIPPET
  const {user} = useAuth()
  const {data, loading} = useQuery<EditHouseQuery, EditHouseQueryVariables>(
    EDIT_HOUSE_QUERY,
    {variables: {id}}
    )

    //check that user has logged in, query has loaded, did query return a house, does current user own this house
    //CLIENT SIDE CHECKS  
    if (!user) return  <Layout main={<div>Please login. </div>} />
    if (loading) return  <Layout main={<div>Loading... </div>} />
    if (data && !data.house) return  <Layout main={<div>Unable to load house. </div>} />
    if (user.uid !== data?.house?.userId) return  <Layout main={<div>You can not edit this house. </div>} />

    return <Layout main={<HouseForm house={data.house} />} />
}

export const getServerSideProps: GetServerSideProps = async({req, res}) => {
  const uid = await loadIdToken(req as NextApiRequest)

  if (!uid){
    res.setHeader("location", "/auth")
    res.statusCode = 302
    res.end()
  }

  return { props: {} }
}