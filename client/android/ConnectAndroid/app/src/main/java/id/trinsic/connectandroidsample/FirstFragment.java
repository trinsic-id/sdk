package id.trinsic.connectandroidsample;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import id.trinsic.connectandroidsample.databinding.FragmentFirstBinding;

import id.trinsic.connectandroid.ConnectClient;

public class FirstFragment extends Fragment {
    private static String LAUNCH_URL = "https://josh.trinsic-local.com/api/session/launch?clientToken=2dsF2CscS9DeQV5Te3YUW69WzfQTVBa2tVQHPLdxY2EhVJSM66TKntquXYzx6bDW2FgHv3bpQBzeNcPHQZmwWHV6LcHmLP46im7LeG8J51WDPT2KFc2QsBe3cY2ZhK3U8p9vz4dC4NMpHD92ssuDUCUyt27qpyJao4RSHwyusDFMECfXhLK4P18mTcfK6mG1YLUCVNzVqu5suxgAL1Pjx4AEdALUeKQix31ECKX1guj576CsCHt6NrWxM9SoaxnvVkyiQVwgHZrkWZADRXaUVfUhS5nMM4JvJAhSw9C2hSKWyGxwZyd&sessionId=04598003-ca3b-4f70-bc1a-b9821c787434&mode=widget";
    private FragmentFirstBinding binding;
    private ConnectClient connectClient;

    @Override
    public View onCreateView(
            LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState
    ) {
        connectClient = new ConnectClient(this, (result) -> {
            if (result.getCanceled()) {
                Toast.makeText(FirstFragment.this.getContext(), "User canceled", Toast.LENGTH_SHORT).show();
                return;
            } else if (!result.getSuccess()) {
                Toast.makeText(FirstFragment.this.getContext(), "Failed", Toast.LENGTH_SHORT).show();
                return;
            } else {
                Toast.makeText(FirstFragment.this.getContext(), "ResultsAccessKey: " + result.getResultsAccessKey(), Toast.LENGTH_SHORT).show();
                return;
            }
        });
        binding = FragmentFirstBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.buttonFirst.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("OnClick", "Invoking connect client");
                connectClient.Invoke(LAUNCH_URL, "trinsic-testbed");
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

}