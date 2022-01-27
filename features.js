function calculateFeatures() {
    const rays = pseudorandom.pick([128, 256, 512, 1024]);
    const mode = pseudorandom.pick(["Black", "White", "Color"]);
    const spin = pseudorandom.pick(["Left", "Right"]);

    const features = {
        "Star": mode,
        "Rays": rays,
        "Spin": spin,
    }

    // console.log(JSON.stringify(features, null, 4));

    // Sends the features to fxhash for processing
    window.$fxhashFeatures = features;
    return features;
}