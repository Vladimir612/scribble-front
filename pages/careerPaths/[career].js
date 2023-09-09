import { useRouter } from "next/router";
import Positions from "../../components/Landing/CarrersAndClasses/positions";
import usePositionsStore from "../../components/State/PositionsState";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "../../components/State/UserState";

const CareerPage = () => {
  const router = useRouter();
  const { career } = router.query;
  let id;

  const [showLoader, setShowLoader] = useState(false);

  const positions = usePositionsStore((state) => state.positions);
  const updatePositions = usePositionsStore((state) => state.updatePositions);

  const updateUserPositions = useUserStore((state) => state.updatePositions);

  useEffect(() => {
    async function fetchPositions() {
      setShowLoader(true);
      try {
        let result = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/Position/getPositions`
        );
        updatePositions(result.data);

        const token = localStorage.getItem("jwtToken");
        if (token === null) {
          setShowLoader(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/Candidate/getMyPositions`;

        let result2 = await axios.get(url, config);

        const myPositions = result2.data.map((item) => ({
          progress: item.progress,
          id: item.position.id,
          image: item.position.image,
          name: item.position.name,
          videoUrl: item.position.videoUrl,
        }));

        updateUserPositions(myPositions);
        setShowLoader(false);
      } catch (err) {
        setShowLoader(false);
        console.log(err);
      }
      setShowLoader(false);
    }

    fetchPositions();
  }, []);

  if (career) {
    id = career.split("=")[1];
  }

  return (
    <Positions
      positionsArr={positions.filter((el) => el.careerId == id)}
      showLoader={showLoader}
    />
  );
};

export default CareerPage;
