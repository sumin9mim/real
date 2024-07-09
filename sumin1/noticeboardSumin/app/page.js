"use client";

import BaseLayout from "@/components/BaseLayout";
import Link from "next/link";
import db from "@/net/db";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";

export default function Home() {
  const [list, setList] = useState([]);
  useEffect(() => {
    onSnapshot(
      query(collection(db, "articles"), orderBy("created_at", "desc")),
      (results) => {
        const newList = [];
        results.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          newList.push(data);
        });
        setList(newList);
      }
    );
    // getDocs(query(collection(db, "articles"), orderBy("created_at", "desc"))) // getDog을 통해 문서를 가져올 수 있다.
    //   .then((results) => {
    //     const newList = [];
    //     results.forEach((doc) => {
    //       const data = doc.data();
    //       data.id = doc.id;
    //       newList.push(data);
    //     });
    //     setList(newList);
    //   });
  }, []);

  const getTimesAgo = (timestamp) => {
    const now = DateTime.now();
    const past = DateTime.fromMillis(timestamp);

    const diffInSeconeds = now.diff(past, "seconds").seconds;
    const diffInMinutes = now.diff(past, "minutes").minutes;
    const diffInHours = now.diff(past, "hours").hours;
    const diffInDays = now.diff(past, "days").days;

    function diffInTimes() {
      if (parseFloat(diffInSeconeds) < 60) {
        return `${parseInt(diffInSeconeds)} 초 전`;
      } else if (parseFloat(diffInMinutes) < 60) {
        return `${parseInt(diffInMinutes)} 분 전`;
      } else if (parseInt(diffInHours) < 24) {
        return `${parseInt(diffInHours)} 시간 전`;
      } else return `${parseInt(diffInDays)}일 전`;
    }

    return diffInTimes();
  };
  const updatedList = [...list].map((item) => {
    const timeAgoPoint =
      parseInt(item.point) - parseInt(getTimesAgo(item.created_at));
    if (getTimesAgo(item.created_at).includes("일")) {
      item["updatedPoint"] = Math.max(0, timeAgoPoint);
    } else {
      item["updatedPoint"] = parseInt(item.point);
    }
    return item;
  });

  const sortedlist = updatedList.sort((a, b) =>
    parseInt(a.updatedPoint) === parseInt(b.updatedPoint)
      ? parseInt(b.id) - parseInt(a.id) //포인트가 있다가 0이 된 애들은 원래 일반이었던 애들보다 위로 가지 못함. (그냥 냅두면 작성순으로 되어버림)
      : parseInt(b.updatedPoint) - parseInt(a.updatedPoint)
  );

  return (
    <BaseLayout>
      <ul>
        <li className="flex flex-row w-full border-b p-2 mb-4">
          <div className="flex-1 font-bold">제목</div>
          <div className="w-64 font-bold">작성자</div>
          <div className="w-64 font-bold">시작포인트</div>
          <div className="w-64 font-bold">현재포인트</div>
          <div className="w-64 font-bold">작성일시</div>
          <div className="w-64 font-bold">지난시간</div>
        </li>
        {sortedlist.map((item) => (
          <li key={item.id} className="flex flex-row w-full border-b p-2 mb-4">
            <div className="flex-1">
              <Link href={`/articles/${item.id}`}>{item.subject}</Link>
            </div>
            <div className="w-64">{item.author}</div>
            <div className="w-64">{parseInt(item.point) || "일반"}</div>
            <div className="w-64">{parseInt(item.updatedPoint) || "일반"}</div>
            <div className="w-64">
              {DateTime.fromMillis(item.created_at).toFormat(
                "yyyy-LL-dd HH:mm:ss"
              )}
            </div>
            <div className="w-64">{getTimesAgo(item.created_at)}</div>
          </li>
        ))}
      </ul>
      <div className="mb-8 w-full flex justify-end">
        <Link href="/create">
          <button className="border p-2 bg-black text-white">글쓰기</button>
        </Link>
      </div>
    </BaseLayout>
  );
}
