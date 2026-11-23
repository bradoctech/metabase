(ns metabase.channel.branding
  "Shared SP signature identity. Read only the bundled coat of arms; no network or instance settings."
  (:require
   [clojure.java.io :as io]
   [clojure.string :as str]
   [clojure.xml :as xml])
  (:import
   (java.awt Color RenderingHints Shape)
   (java.awt.geom PathIterator)
   (java.awt.image BufferedImage)
   (java.io ByteArrayOutputStream StringReader)
   (javax.imageio ImageIO)
   (org.apache.batik.parser AWTPathProducer)))

(set! *warn-on-reflection* true)

(def product-name "Dashboards SP")
(def logo-resource "frontend_client/app/assets/img/logo.svg")

(defn- fill-color ^Color [fill]
  (Color/decode (if (re-matches #"#[0-9a-fA-F]{3}" fill)
                  (str "#" (apply str (mapcat #(repeat 2 %) (subs fill 1))))
                  fill)))

(defn- shape-path [tag {:keys [d points x y width height]}]
  (case tag
    :path d
    :polyline (str "M" points "z")
    :rect (format "M%s,%s h%s v%s h-%s z" (or x "0") (or y "0") width height width)
    nil))

(defn- shapes [node inherited-fill]
  (when (map? node)
    (let [{:keys [tag attrs content]} node
          fill (or (:fill attrs) inherited-fill)]
      (concat
       (when-let [path (shape-path tag attrs)]
         [{:color (fill-color fill)
           :shape (AWTPathProducer/createShape (StringReader. path) PathIterator/WIND_NON_ZERO)}])
       (mapcat #(shapes % fill) content)))))

(def coat-of-arms
  "Bundled SVG shapes in paint order, with inherited/per-shape fills resolved. Includes paths, rects and polylines."
  (delay
    (with-open [stream (io/input-stream (io/resource logo-resource))]
      (let [root (xml/parse stream)
            [_ _ width height] (mapv parse-double (str/split (get-in root [:attrs :viewBox]) #"\s+"))]
        {:vw width :vh height :shapes (vec (shapes root "#000000"))}))))

(def ^:private coat-of-arms-png
  (delay
    (let [{:keys [vw vh shapes]} @coat-of-arms
          height 512
          scale (/ height vh)
          image (BufferedImage. (int (Math/ceil (* vw scale))) height BufferedImage/TYPE_INT_ARGB)
          graphics (.createGraphics image)]
      (try
        (.setRenderingHint graphics RenderingHints/KEY_ANTIALIASING RenderingHints/VALUE_ANTIALIAS_ON)
        (.scale graphics scale scale)
        (doseq [{:keys [color shape]} shapes]
          (.setColor graphics ^Color color)
          (.fill graphics ^Shape shape))
        (with-open [out (ByteArrayOutputStream.)]
          (ImageIO/write image "png" out)
          (.toByteArray out))
        (finally (.dispose graphics))))))

(defn png-bytes
  "Transparent, high-resolution coat of arms for CID email attachments and Slack file uploads."
  ^bytes []
  @coat-of-arms-png)
